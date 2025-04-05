
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
require_once 'db-connect.php';

// Get a certificate by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $certificateId = $_GET['id'];
    
    try {
        $stmt = $conn->prepare("
            SELECT c.*, u.name as user_name, u.email as user_email, e.title as event_title, e.date as event_date 
            FROM certificates c 
            JOIN users u ON c.user_id = u.id 
            JOIN events e ON c.event_id = e.id 
            WHERE c.id = ?
        ");
        $stmt->bind_param("s", $certificateId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Certificate not found']);
            exit;
        }
        
        $certificate = $result->fetch_assoc();
        
        // Update the downloaded status
        if (isset($_GET['download']) && $_GET['download'] === 'true') {
            $updateStmt = $conn->prepare("
                UPDATE certificates 
                SET downloaded = true 
                WHERE id = ?
            ");
            $updateStmt->bind_param("s", $certificateId);
            $updateStmt->execute();
        }
        
        echo json_encode($certificate);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch certificate: ' . $e->getMessage()]);
    }
}

// Verify a certificate is authentic
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['verify'])) {
    $certificateId = $_GET['verify'];
    
    try {
        $stmt = $conn->prepare("
            SELECT c.id, c.event_id, c.user_id, c.issued_date, 
                   u.name as user_name, e.title as event_title
            FROM certificates c 
            JOIN users u ON c.user_id = u.id 
            JOIN events e ON c.event_id = e.id 
            WHERE c.id = ?
        ");
        $stmt->bind_param("s", $certificateId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['valid' => false, 'message' => 'Invalid certificate']);
            exit;
        }
        
        $certificate = $result->fetch_assoc();
        echo json_encode([
            'valid' => true, 
            'certificate' => [
                'id' => $certificate['id'],
                'user_name' => $certificate['user_name'],
                'event_title' => $certificate['event_title'],
                'issued_date' => $certificate['issued_date']
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['valid' => false, 'message' => 'Error verifying certificate: ' . $e->getMessage()]);
    }
}

// Close connection
$conn->close();
?>
