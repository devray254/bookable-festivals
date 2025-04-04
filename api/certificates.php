
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
require_once 'db-connect.php';

// Get certificates for an event
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['event_id'])) {
    $eventId = $_GET['event_id'];
    
    try {
        $stmt = $conn->prepare("
            SELECT c.*, u.name as user_name, u.email as user_email, e.title as event_title 
            FROM certificates c 
            JOIN users u ON c.user_id = u.id 
            JOIN events e ON c.event_id = e.id 
            WHERE c.event_id = ? 
            ORDER BY c.issued_date DESC
        ");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $certificates = [];
        while ($row = $result->fetch_assoc()) {
            $certificates[] = $row;
        }
        
        echo json_encode($certificates);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch certificates: ' . $e->getMessage()]);
    }
}

// Get certificates for a user
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user_id'])) {
    $userId = $_GET['user_id'];
    
    try {
        $stmt = $conn->prepare("
            SELECT c.*, e.title as event_title 
            FROM certificates c 
            JOIN events e ON c.event_id = e.id 
            WHERE c.user_id = ? 
            ORDER BY c.issued_date DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $certificates = [];
        while ($row = $result->fetch_assoc()) {
            $certificates[] = $row;
        }
        
        echo json_encode($certificates);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch user certificates: ' . $e->getMessage()]);
    }
}

// Generate certificate for a single user
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['bulk'])) {
    // Get request body
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    
    if (!isset($data['eventId']) || !isset($data['userId']) || !isset($data['adminEmail'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $eventId = $data['eventId'];
    $userId = $data['userId'];
    $adminEmail = $data['adminEmail'];
    
    try {
        // Check if certificate already exists
        $checkStmt = $conn->prepare("SELECT id FROM certificates WHERE event_id = ? AND user_id = ?");
        $checkStmt->bind_param("ii", $eventId, $userId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $existingCert = $checkResult->fetch_assoc();
            echo json_encode([
                'success' => true, 
                'certificateId' => $existingCert['id'],
                'message' => 'Certificate already exists'
            ]);
            exit;
        }
        
        // Generate certificate ID
        $certificateId = "CERT-{$eventId}-{$userId}-" . time();
        
        // Insert certificate
        $stmt = $conn->prepare("
            INSERT INTO certificates (id, event_id, user_id, issued_date, issued_by, sent_email, downloaded) 
            VALUES (?, ?, ?, NOW(), ?, false, false)
        ");
        $stmt->bind_param("siis", $certificateId, $eventId, $userId, $adminEmail);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true, 
                'certificateId' => $certificateId,
                'message' => 'Certificate generated successfully'
            ]);
            
            // Log activity
            $logStmt = $conn->prepare("
                INSERT INTO activity_logs (timestamp, action, user, details, ip, level) 
                VALUES (NOW(), 'Certificate Generated', ?, ?, ?, 'info')
            ");
            $details = "Certificate {$certificateId} generated for user {$userId} for event {$eventId}";
            $ip = $_SERVER['REMOTE_ADDR'];
            $logStmt->bind_param("sss", $adminEmail, $details, $ip);
            $logStmt->execute();
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to generate certificate']);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error generating certificate: ' . $e->getMessage()]);
    }
}

// Bulk generate certificates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['bulk'])) {
    // Get request body
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    
    if (!isset($data['eventId']) || !isset($data['adminEmail'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $eventId = $data['eventId'];
    $adminEmail = $data['adminEmail'];
    
    try {
        // Get all users who have paid for this event
        $attendeesStmt = $conn->prepare("
            SELECT DISTINCT u.id, u.name, u.email 
            FROM users u 
            JOIN bookings b ON u.id = b.user_id 
            JOIN payments p ON b.id = p.booking_id 
            WHERE b.event_id = ? AND p.status = 'completed'
        ");
        $attendeesStmt->bind_param("i", $eventId);
        $attendeesStmt->execute();
        $attendeesResult = $attendeesStmt->get_result();
        
        $attendees = [];
        while ($row = $attendeesResult->fetch_assoc()) {
            $attendees[] = $row;
        }
        
        if (count($attendees) === 0) {
            echo json_encode(['success' => false, 'message' => 'No paid attendees found for this event']);
            exit;
        }
        
        $generatedCertificates = [];
        
        // Generate certificates for each attendee
        foreach ($attendees as $attendee) {
            // Check if certificate already exists
            $checkStmt = $conn->prepare("SELECT id FROM certificates WHERE event_id = ? AND user_id = ?");
            $checkStmt->bind_param("ii", $eventId, $attendee['id']);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows > 0) {
                continue; // Skip if certificate already exists
            }
            
            // Generate certificate ID
            $certificateId = "CERT-{$eventId}-{$attendee['id']}-" . time();
            
            // Insert certificate
            $stmt = $conn->prepare("
                INSERT INTO certificates (id, event_id, user_id, issued_date, issued_by, sent_email, downloaded) 
                VALUES (?, ?, ?, NOW(), ?, false, false)
            ");
            $stmt->bind_param("siis", $certificateId, $eventId, $attendee['id'], $adminEmail);
            $stmt->execute();
            
            if ($stmt->affected_rows > 0) {
                $generatedCertificates[] = [
                    'certificateId' => $certificateId,
                    'userId' => $attendee['id'],
                    'userName' => $attendee['name'],
                    'userEmail' => $attendee['email']
                ];
            }
        }
        
        // Log activity
        $logStmt = $conn->prepare("
            INSERT INTO activity_logs (timestamp, action, user, details, ip, level) 
            VALUES (NOW(), 'Bulk Certificate Generation', ?, ?, ?, 'important')
        ");
        $details = count($generatedCertificates) . " certificates generated for event {$eventId}";
        $ip = $_SERVER['REMOTE_ADDR'];
        $logStmt->bind_param("sss", $adminEmail, $details, $ip);
        $logStmt->execute();
        
        echo json_encode([
            'success' => true,
            'generated' => count($generatedCertificates),
            'total' => count($attendees),
            'certificates' => $generatedCertificates,
            'message' => "Generated " . count($generatedCertificates) . " new certificates out of " . count($attendees) . " attendees"
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error generating certificates in bulk: ' . $e->getMessage()]);
    }
}

// Close connection
$conn->close();
?>
