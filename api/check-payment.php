
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

// Get the JSON data from the request
$requestData = json_decode(file_get_contents('php://input'), true);

// Validate the request
if (!isset($requestData['checkout_request_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing checkout_request_id']);
    exit();
}

$checkoutRequestId = $requestData['checkout_request_id'];

try {
    // Check if payment exists in payments table
    $stmt = $conn->prepare("
        SELECT id, mpesa_receipt, amount, status, result_desc 
        FROM payments 
        WHERE checkout_request_id = ?
        ORDER BY id DESC LIMIT 1
    ");
    
    $stmt->bind_param("s", $checkoutRequestId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Payment found
        $payment = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'paid' => ($payment['status'] === 'completed'),
            'status' => $payment['status'],
            'receipt' => $payment['mpesa_receipt'],
            'amount' => $payment['amount'],
            'message' => $payment['result_desc']
        ]);
    } else {
        // Check if there's a pending payment request
        $requestStmt = $conn->prepare("
            SELECT pr.id, pr.booking_id, pr.timestamp
            FROM payment_requests pr
            WHERE pr.checkout_request_id = ?
        ");
        
        $requestStmt->bind_param("s", $checkoutRequestId);
        $requestStmt->execute();
        $requestResult = $requestStmt->get_result();
        
        if ($requestResult->num_rows > 0) {
            // Payment request found but no completed payment yet
            echo json_encode([
                'success' => true,
                'paid' => false,
                'status' => 'pending',
                'message' => 'Payment request is being processed. Please complete the payment on your phone.'
            ]);
        } else {
            // No payment request found
            echo json_encode([
                'success' => false,
                'paid' => false,
                'status' => 'not_found',
                'message' => 'No payment request found with the provided ID.'
            ]);
        }
        
        $requestStmt->close();
    }
    
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error checking payment status: ' . $e->getMessage()
    ]);
}

// Close the connection
$conn->close();
?>
