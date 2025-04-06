
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
require_once 'db-connect.php';

// Send email
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get request body
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    
    if (!isset($data['to']) || !isset($data['subject']) || !isset($data['body'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $to = $data['to'];
    $subject = $data['subject'];
    $body = $data['body'];
    $attachmentUrl = isset($data['attachmentUrl']) ? $data['attachmentUrl'] : null;
    $certificateId = isset($data['certificateId']) ? $data['certificateId'] : null;
    
    try {
        // Get Gmail settings
        $settingsStmt = $conn->prepare("
            SELECT `key`, value FROM settings 
            WHERE category = 'gmail'
        ");
        $settingsStmt->execute();
        $settingsResult = $settingsStmt->get_result();
        
        $settings = [];
        while ($row = $settingsResult->fetch_assoc()) {
            $settings[$row['key']] = $row['value'];
        }
        
        // Check if Gmail is enabled
        if (!isset($settings['enabled']) || $settings['enabled'] !== '1') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Gmail integration is not enabled']);
            exit;
        }
        
        // Headers for HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: Maabara Online <noreply@maabara.co.ke>" . "\r\n";
        
        // In a production environment, you would:
        // 1. Use Gmail API or PHPMailer library with SMTP
        // 2. Handle attachments properly
        // 3. Set up proper email authentication (SPF, DKIM)
        
        // For demo purposes, we'll use the basic mail() function
        $mailSuccess = mail($to, $subject, $body, $headers);
        
        if ($mailSuccess) {
            // Log the email activity
            if ($certificateId) {
                // Update certificate sent status
                $updateStmt = $conn->prepare("
                    UPDATE certificates SET sent_email = true 
                    WHERE id = ?
                ");
                $updateStmt->bind_param("s", $certificateId);
                $updateStmt->execute();
            }
            
            // Log activity
            $logStmt = $conn->prepare("
                INSERT INTO activity_logs (timestamp, action, user, details, ip, level) 
                VALUES (NOW(), 'Email Sent', ?, ?, ?, 'info')
            ");
            $userValue = "admin"; // In a real app, this would be the admin user
            $details = "Email sent to {$to} with subject: {$subject}";
            $ip = $_SERVER['REMOTE_ADDR'];
            $logStmt->bind_param("sss", $userValue, $details, $ip);
            $logStmt->execute();
            
            echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to send email']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error sending email: ' . $e->getMessage()]);
    }
}

// Close connection
$conn->close();
?>
