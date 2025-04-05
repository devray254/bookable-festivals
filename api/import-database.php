
<?php
// This script imports the database structure and mock data
// CAUTION: Only use on your development or testing server!

// Set error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters - updated to match your online server
$host = '92.113.28.141';
$user = 'u944702148_baraportal';
$password = 'K@m1kaze.12.12!';
$dbname = 'u944702148_maabaraonline';

// Path to the SQL file
$sqlFilePath = __DIR__ . '/database-with-mock-data.sql';

// Function to execute SQL file
function executeSqlFile($host, $user, $password, $sqlFilePath) {
    // Create database connection
    $conn = new mysqli($host, $user, $password);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "<p>Connected to MySQL server successfully.</p>";
    
    // Read SQL file
    $sql = file_get_contents($sqlFilePath);
    
    if (!$sql) {
        die("Error reading SQL file: $sqlFilePath");
    }
    
    echo "<p>SQL file read successfully.</p>";
    
    // Execute multi-query SQL
    if ($conn->multi_query($sql)) {
        echo "<p>Database setup started...</p>";
        
        // Process all result sets
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());
        
        if ($conn->error) {
            die("Error executing SQL: " . $conn->error);
        }
        
        echo "<p>Database setup completed successfully!</p>";
    } else {
        die("Error executing SQL: " . $conn->error);
    }
    
    $conn->close();
}

// HTML output
echo "<!DOCTYPE html>
<html>
<head>
    <title>Database Import Tool</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .success { color: green; }
        .error { color: red; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
    </style>
</head>
<body>
    <h1>Maabara Events Database Setup</h1>";

// Check if the SQL file exists
if (!file_exists($sqlFilePath)) {
    echo "<p class='error'>Error: SQL file not found at $sqlFilePath</p>";
} else {
    echo "<p>SQL file found at: $sqlFilePath</p>";
    
    // Check if user requested import
    if (isset($_GET['import']) && $_GET['import'] === 'yes') {
        echo "<h2>Importing Database...</h2>";
        
        try {
            executeSqlFile($host, $user, $password, $sqlFilePath);
            echo "<p class='success'>Database imported successfully! You can now use the application.</p>";
        } catch (Exception $e) {
            echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
        }
    } else {
        echo "<p>Click the button below to import the database. This will:</p>
        <ul>
            <li>Create the 'maabara_events' database if it doesn't exist</li>
            <li>Create all required tables</li>
            <li>Import sample data for testing</li>
        </ul>
        <p><strong>Warning:</strong> If the database already exists, this will overwrite any existing data!</p>
        <p><a href='?import=yes' style='display: inline-block; background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;'>Import Database</a></p>";
    }
}

echo "</body></html>";
?>
