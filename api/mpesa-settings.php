
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

// Get settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT * FROM mpesa_settings WHERE id = 1");
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $settings = $result->fetch_assoc();
            echo json_encode($settings);
        } else {
            // Return default values if no settings found
            echo json_encode([
                'consumer_key' => '',
                'consumer_secret' => '',
                'passkey' => '',
                'shortcode' => '',
                'environment' => 'sandbox',
                'callback_url' => 'https://example.com/callback'
            ]);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to fetch M-Pesa settings: ' . $e->getMessage()]);
    }
}

// Update settings
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get request body
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        
        // Validate required fields
        if (!isset($data['consumer_key']) || !isset($data['consumer_secret']) || 
            !isset($data['passkey']) || !isset($data['shortcode'])) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'Missing required fields']);
            exit;
        }
        
        // Set defaults for optional fields
        $environment = $data['environment'] ?? 'sandbox';
        $callback_url = $data['callback_url'] ?? 'https://example.com/callback';
        $updated_by = $data['updated_by'] ?? 'admin';
        
        // Check if settings already exist
        $checkStmt = $conn->prepare("SELECT COUNT(*) as count FROM mpesa_settings WHERE id = 1");
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        $row = $result->fetch_assoc();
        $exists = $row['count'] > 0;
        $checkStmt->close();
        
        if ($exists) {
            // Update existing settings
            $stmt = $conn->prepare("UPDATE mpesa_settings SET 
                consumer_key = ?, 
                consumer_secret = ?, 
                passkey = ?, 
                shortcode = ?, 
                environment = ?,
                callback_url = ?,
                last_updated = NOW(),
                updated_by = ?
                WHERE id = 1");
                
            $stmt->bind_param("sssssss", 
                $data['consumer_key'], 
                $data['consumer_secret'], 
                $data['passkey'], 
                $data['shortcode'], 
                $environment,
                $callback_url,
                $updated_by
            );
        } else {
            // Insert new settings
            $stmt = $conn->prepare("INSERT INTO mpesa_settings 
                (id, consumer_key, consumer_secret, passkey, shortcode, environment, callback_url, last_updated, updated_by) 
                VALUES (1, ?, ?, ?, ?, ?, ?, NOW(), ?)");
                
            $stmt->bind_param("sssssss", 
                $data['consumer_key'], 
                $data['consumer_secret'], 
                $data['passkey'], 
                $data['shortcode'], 
                $environment,
                $callback_url,
                $updated_by
            );
        }
        
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'M-Pesa settings updated successfully']);
        } else {
            echo json_encode(['success' => true, 'message' => 'No changes were made to M-Pesa settings']);
        }
        
        $stmt->close();
        
        // Log the activity
        $logStmt = $conn->prepare("INSERT INTO activity_logs (timestamp, action, user, details, ip, level) 
                                 VALUES (NOW(), 'update_mpesa_settings', ?, 'M-Pesa settings updated', ?, 'info')");
        $logStmt->bind_param("ss", $updated_by, $_SERVER['REMOTE_ADDR']);
        $logStmt->execute();
        $logStmt->close();
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => true, 'message' => 'Failed to update M-Pesa settings: ' . $e->getMessage()]);
    }
}

// Close connection
$conn->close();
?>
