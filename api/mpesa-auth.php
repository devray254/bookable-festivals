
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

// Get the Authorization header
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';

if (empty($authHeader)) {
    http_response_code(401);
    echo json_encode(['error' => 'missing_auth', 'error_description' => 'Authorization header is required']);
    exit;
}

// Include database connection
require_once 'db-config.php';

// Get M-Pesa settings from database
$stmt = $conn->prepare("SELECT * FROM mpesa_settings WHERE id = 1");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'mpesa_not_configured', 'error_description' => 'M-Pesa settings not configured']);
    exit;
}

$settings = $result->fetch_assoc();
$stmt->close();

// Determine API URL based on environment
$apiUrl = $settings['environment'] === 'production' 
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: ' . $authHeader
]);

// Execute cURL session and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'curl_error', 'error_description' => curl_error($ch)]);
    exit;
}

// Get HTTP status code
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Close cURL session
curl_close($ch);

// Log the authentication attempt
try {
    $stmt = $conn->prepare("INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (NOW(), 'mpesa_auth', 'system', ?, ?, 'info')");
    $details = "M-Pesa auth request. Status: " . $httpCode;
    $ip = $_SERVER['REMOTE_ADDR'];
    $stmt->bind_param("ss", $details, $ip);
    $stmt->execute();
    $stmt->close();
} catch (Exception $e) {
    // Just log the error, don't affect the response
    error_log('Error logging auth attempt: ' . $e->getMessage());
}

// Forward the response from Safaricom
http_response_code($httpCode);
echo $response;

// Close connection
$conn->close();
?>
