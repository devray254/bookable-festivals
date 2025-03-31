
<?php
// Set headers for JSON response
header('Content-Type: application/json');

// Try to include database configuration
try {
    require_once 'db-config.php';
    
    // If we reach here, the connection was successful
    echo json_encode(['connected' => true]);
} catch (Exception $e) {
    // Connection failed
    echo json_encode([
        'connected' => false,
        'error' => $e->getMessage()
    ]);
}
?>
