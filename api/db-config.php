
<?php
// Database configuration
$host = 'localhost'; // Change this to your database server hostname
$user = 'root';      // Change this to your database username
$password = '';      // Change this to your database password
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
