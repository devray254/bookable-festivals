
<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// If this is a preflight OPTIONS request, return early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db-config.php';

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Validate request data
if (!isset($data['accessToken']) || !isset($data['phoneNumber']) || !isset($data['amount'])) {
    http_response_code(400);
    echo json_encode(['ResponseCode' => '1', 'ResponseDescription' => 'Missing required parameters']);
    exit;
}

// Get M-Pesa settings from database
$stmt = $conn->prepare("SELECT * FROM mpesa_settings WHERE id = 1");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(['ResponseCode' => '1', 'ResponseDescription' => 'M-Pesa settings not configured']);
    exit;
}

$settings = $result->fetch_assoc();
$stmt->close();

// M-Pesa API constants from database
$MPESA_SHORTCODE = $settings['shortcode'];
$MPESA_ENVIRONMENT = $settings['environment'];
$MPESA_CALLBACK_URL = $settings['callback_url'];

// Extract data from request
$accessToken = $data['accessToken'];
$phoneNumber = $data['phoneNumber'];
$amount = $data['amount'];
$accountReference = $data['accountReference'] ?? 'Event Booking';
$transactionDesc = $data['transactionDesc'] ?? 'Event Booking Payment';
$timestamp = $data['timestamp'] ?? null;
$password = $data['password'] ?? null;

// Determine API URL based on environment
$apiUrl = $MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Initialize cURL session
$ch = curl_init($apiUrl);

// Prepare the request payload
$payload = [
    'BusinessShortCode' => $MPESA_SHORTCODE,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerPayBillOnline',
    'Amount' => $amount,
    'PartyA' => $phoneNumber,
    'PartyB' => $MPESA_SHORTCODE,
    'PhoneNumber' => $phoneNumber,
    'CallBackURL' => $MPESA_CALLBACK_URL,
    'AccountReference' => $accountReference,
    'TransactionDesc' => $transactionDesc
];

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $accessToken,
    'Content-Type: application/json'
]);

// Execute cURL session and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['ResponseCode' => '1', 'ResponseDescription' => 'API request failed: ' . curl_error($ch)]);
    exit;
}

// Get HTTP status code
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Close cURL session
curl_close($ch);

// Log the transaction attempt to database
try {
    $stmt = $conn->prepare("INSERT INTO payment_logs (request_data, response_data, phone, amount, timestamp) VALUES (?, ?, ?, ?, NOW())");
    $requestData = json_encode($payload);
    $responseData = $response;
    $stmt->bind_param("sssd", $requestData, $responseData, $phoneNumber, $amount);
    $stmt->execute();
    $stmt->close();
} catch (Exception $e) {
    // Just log the error, don't affect the response
    error_log('Error logging payment: ' . $e->getMessage());
}

// Forward the response from Safaricom
http_response_code($httpCode);
echo $response;

// Close connection
$conn->close();
?>
