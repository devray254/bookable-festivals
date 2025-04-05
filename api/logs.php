
<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// If this is a preflight OPTIONS request, return early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db-config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get optional limit parameter
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
        if ($limit <= 0 || $limit > 1000) {
            $limit = 100; // Default or cap at 1000
        }
        
        // Get logs from database
        $stmt = $conn->prepare("SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT ?");
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $logs = array();
        while ($row = $result->fetch_assoc()) {
            $logs[] = $row;
        }
        
        echo json_encode($logs);
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching logs: ' . $e->getMessage()
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
