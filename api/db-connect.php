
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

// Database connection parameters
$host = 'https://lightgray-peafowl-752159.hostingersite.com/'; // Online database server hostname
$user = 'u944702148_baraportal';  // Online database username
$password = 'K@m1kaze.12.12!';    // Online database password
$dbname = 'u944702148_maabaraonline';

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
