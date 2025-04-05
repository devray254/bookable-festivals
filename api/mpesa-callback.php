
<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'db-config.php';

// Get the raw POST data
$callbackData = file_get_contents('php://input');

// Log the raw callback data
file_put_contents('mpesa_callback_log.txt', date('Y-m-d H:i:s') . " - " . $callbackData . PHP_EOL, FILE_APPEND);

// Decode the JSON data
$decodedData = json_decode($callbackData, true);

// Validate the callback data
if (!$decodedData || !isset($decodedData['Body'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid callback data']);
    exit();
}

try {
    // Extract the relevant information from the callback
    $resultCode = $decodedData['Body']['stkCallback']['ResultCode'] ?? null;
    $resultDesc = $decodedData['Body']['stkCallback']['ResultDesc'] ?? 'No description';
    $merchantRequestID = $decodedData['Body']['stkCallback']['MerchantRequestID'] ?? '';
    $checkoutRequestID = $decodedData['Body']['stkCallback']['CheckoutRequestID'] ?? '';
    
    // Get callback metadata if available
    $metadata = [];
    if (isset($decodedData['Body']['stkCallback']['CallbackMetadata']['Item']) && 
        is_array($decodedData['Body']['stkCallback']['CallbackMetadata']['Item'])) {
        
        foreach ($decodedData['Body']['stkCallback']['CallbackMetadata']['Item'] as $item) {
            if (isset($item['Name'], $item['Value'])) {
                $metadata[$item['Name']] = $item['Value'];
            }
        }
    }
    
    // Extract transaction details
    $mpesaReceiptNumber = $metadata['MpesaReceiptNumber'] ?? '';
    $transactionDate = $metadata['TransactionDate'] ?? '';
    $phoneNumber = $metadata['PhoneNumber'] ?? '';
    $amount = $metadata['Amount'] ?? 0;
    
    // Determine transaction status
    $status = ($resultCode === 0) ? 'completed' : 'failed';
    
    // Insert data into the database
    $stmt = $conn->prepare("INSERT INTO payments (
        mpesa_receipt, 
        merchant_request_id, 
        checkout_request_id, 
        amount, 
        phone_number, 
        transaction_date, 
        status, 
        result_code, 
        result_desc,
        raw_callback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "sssdssisss",
        $mpesaReceiptNumber,
        $merchantRequestID,
        $checkoutRequestID,
        $amount,
        $phoneNumber,
        $transactionDate,
        $status,
        $resultCode,
        $resultDesc,
        $callbackData
    );
    
    $stmt->execute();
    
    // Get the inserted payment ID
    $paymentId = $conn->insert_id;
    
    // If payment is successful, update the associated booking
    if ($status === 'completed') {
        // Look up the booking by checkout request ID
        $bookingStmt = $conn->prepare("
            SELECT b.id FROM bookings b
            JOIN payment_requests pr ON b.id = pr.booking_id
            WHERE pr.checkout_request_id = ?
            LIMIT 1
        ");
        
        $bookingStmt->bind_param("s", $checkoutRequestID);
        $bookingStmt->execute();
        $bookingResult = $bookingStmt->get_result();
        
        if ($bookingResult->num_rows > 0) {
            $bookingRow = $bookingResult->fetch_assoc();
            $bookingId = $bookingRow['id'];
            
            // Update the booking status
            $updateStmt = $conn->prepare("
                UPDATE bookings 
                SET status = 'confirmed', payment_id = ? 
                WHERE id = ?
            ");
            
            $updateStmt->bind_param("ii", $paymentId, $bookingId);
            $updateStmt->execute();
            $updateStmt->close();
        }
        
        $bookingStmt->close();
    }
    
    // Log the successful processing
    error_log("M-Pesa callback processed successfully: " . $mpesaReceiptNumber . " with status " . $status);
    
    // Return success response
    echo json_encode([
        'success' => true, 
        'message' => 'Callback processed successfully',
        'status' => $status,
        'receipt' => $mpesaReceiptNumber
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log("M-Pesa callback error: " . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error processing callback: ' . $e->getMessage()]);
}

// Close database connection
$conn->close();
?>
