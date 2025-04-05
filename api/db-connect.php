
<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

// Database connection parameters - update these to match your online server
$host = 'your-online-mysql-host.com'; // Change this to your online database server hostname
$user = 'your_db_username';           // Change this to your online database username
$password = 'your_db_password';       // Change this to your online database password
$dbname = 'maabara_events';

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode([
        'error' => true,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

// Set character set
$conn->set_charset("utf8mb4");

// Log database connection for troubleshooting
error_log("Database connection established to $dbname at $host");
?>
