
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
    die("<div class='error'>Connection failed: " . $conn->connect_error . "</div>");
}

echo "<h2>Starting database installation...</h2>";

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS `{$DB_NAME}`";
if ($conn->query($sql) === TRUE) {
    echo "<p class='success'>Database created successfully or already exists.</p>";
} else {
    die("<div class='error'>Error creating database: " . $conn->error . "</div>");
}

// Switch to the database
$conn->select_db($DB_NAME);

// Import SQL schema from file
$sqlFile = file_get_contents(__DIR__ . '/install-database.sql');
if (!$sqlFile) {
    die("<div class='error'>Error reading SQL file.</div>");
}

// Split SQL file into separate queries
$queries = explode(';', $sqlFile);
$success = true;
$errors = [];

foreach ($queries as $query) {
    $query = trim($query);
    if (empty($query)) {
        continue;
    }
    
    if ($conn->query($query) !== TRUE) {
        $success = false;
        $errors[] = $conn->error . " in query: " . htmlspecialchars(substr($query, 0, 150)) . "...";
    }
}

if ($success) {
    echo "<h2 class='success'>Database setup completed successfully!</h2>";
    echo "<p>You can now <a href='../'>proceed to the application</a>.</p>";
} else {
    echo "<h2 class='warning'>Database setup completed with warnings:</h2>";
    echo "<ul class='error'>";
    foreach ($errors as $error) {
        echo "<li>" . $error . "</li>";
    }
    echo "</ul>";
    echo "<p>The application may still work if these are not critical errors.</p>";
    echo "<p>You can <a href='../'>proceed to the application</a> or contact the administrator.</p>";
}

// Create htaccess file for security if it doesn't exist
$htaccessContent = file_get_contents(__DIR__ . '/htaccess-template');
if ($htaccessContent && !file_exists('../.htaccess')) {
    file_put_contents('../.htaccess', $htaccessContent);
    echo "<p>Created .htaccess file for security.</p>";
}

// Close connection
$conn->close();
?>

<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
    }
    h2 {
        margin-top: 20px;
        color: #2c3e50;
    }
    .success {
        color: #2ecc71;
    }
    .warning {
        color: #f39c12;
    }
    .error {
        color: #e74c3c;
    }
    pre {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
    }
    a {
        color: #3498db;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
