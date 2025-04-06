
<?php
// One-time setup script for installing the database during deployment

// Set error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters from config
require_once '../config.php';

// Create database connection
$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h2>Starting database installation...</h2>";

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS `{$DB_NAME}`";
if ($conn->query($sql) === TRUE) {
    echo "<p>Database created successfully or already exists.</p>";
} else {
    die("Error creating database: " . $conn->error);
}

// Switch to the database
$conn->select_db($DB_NAME);

// Import SQL schema from file
$sqlFile = file_get_contents(__DIR__ . '/install-database.sql');
if (!$sqlFile) {
    die("Error reading SQL file.");
}

// Split SQL file into separate queries
$queries = explode(';', $sqlFile);
foreach ($queries as $query) {
    $query = trim($query);
    if (empty($query)) {
        continue;
    }
    
    if ($conn->query($query) !== TRUE) {
        echo "<p>Error executing query: " . $conn->error . "</p>";
        echo "<pre>" . htmlspecialchars($query) . "</pre>";
    }
}

echo "<h2>Database setup completed successfully!</h2>";
echo "<p>You can now <a href='../'>proceed to the application</a>.</p>";

// Close connection
$conn->close();
?>
