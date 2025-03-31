
<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// If this is a preflight OPTIONS request, return early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Validate request data
if (!isset($data['event']) || !isset($data['customer']) || !isset($data['email']) || 
    !isset($data['phone']) || !isset($data['date']) || !isset($data['tickets']) || 
    !isset($data['total']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required booking data']);
    exit;
}

// Include database configuration
require_once 'db-config.php';

try {
    // Prepare and execute the insert query
    $stmt = $conn->prepare("INSERT INTO bookings (event, customer, email, phone, date, tickets, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssiss", 
        $data['event'], 
        $data['customer'], 
        $data['email'], 
        $data['phone'], 
        $data['date'], 
        $data['tickets'], 
        $data['total'], 
        $data['status']
    );
    
    if ($stmt->execute()) {
        $bookingId = $stmt->insert_id;
        $stmt->close();
        
        // Log the booking activity
        $stmt = $conn->prepare("INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (NOW(), ?, ?, ?, ?, ?)");
        $action = "Booking Created";
        $user = $data['email'];
        $details = "Created booking for " . $data['event'] . " with " . $data['tickets'] . " tickets";
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $level = "info";
        $stmt->bind_param("sssss", $action, $user, $details, $ip, $level);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode(['success' => true, 'id' => $bookingId]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Booking creation failed: ' . $e->getMessage()]);
}

// Close connection
$conn->close();
?>
