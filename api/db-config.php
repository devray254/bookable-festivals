
<?php
// Database configuration
$host = '92.113.28.141:3306'; // Online database server hostname
$user = 'u944702148_baraportal';  // Online database username
$password = 'K@m1kaze.12.12!';    // Online database password
$dbname = 'u944702148_maabaraonline';

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set
$conn->set_charset("utf8mb4");
?>
