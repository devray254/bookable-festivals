
<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// If this is a preflight OPTIONS request, return early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db-config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get request body
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        
        if (!$data) {
            throw new Exception('Invalid request data');
        }
        
        // Validate required fields
        if (!isset($data['action']) || !isset($data['user']) || !isset($data['details'])) {
            throw new Exception('Missing required log fields');
        }
        
        // Set defaults for optional fields
        $level = $data['level'] ?? 'info';
        $ip = $data['ip'] ?? $_SERVER['REMOTE_ADDR'];
        
        // Prepare the timestamp
        $timestamp = date('Y-m-d H:i:s');
        
        // Insert log
        $stmt = $conn->prepare("INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $timestamp, $data['action'], $data['user'], $data['details'], $ip, $level);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Activity logged successfully',
                'id' => $stmt->insert_id
            ]);
        } else {
            throw new Exception('Failed to insert log');
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error logging activity: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

// Close connection
$conn->close();
?>
