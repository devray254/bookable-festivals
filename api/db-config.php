
<?php
// Database configuration
$host = 'your-online-mysql-host.com'; // Change this to your online database server hostname
$user = 'your_db_username';           // Change this to your online database username
$password = 'your_db_password';       // Change this to your online database password
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
