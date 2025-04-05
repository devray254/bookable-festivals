
<?php
// Database configuration
$host = 'https://lightgray-peafowl-752159.hostingersite.com/'; // Online database server hostname
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
