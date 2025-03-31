
<?php
// Database configuration
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'maabara_events';

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set
$conn->set_charset("utf8mb4");
?>
