
<?php
// Include the configuration file with sensitive information
require_once 'config.php';

// Database configuration 
$host = $DB_HOST;
$user = $DB_USER;  
$password = $DB_PASSWORD;
$dbname = $DB_NAME;

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    if ($DEBUG_MODE) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        die("Connection failed: Database connection error. Please check your configuration.");
    }
}

// Set character set
$conn->set_charset("utf8mb4");
?>
