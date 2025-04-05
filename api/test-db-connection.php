
<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection parameters
$host = 'https://lightgray-peafowl-752159.hostingersite.com/';
$user = 'u944702148_baraportal';
$password = 'K@m1kaze.12.12!';
$dbname = 'u944702148_maabaraonline';

// Test connection function
function testDatabaseConnection($host, $user, $password, $dbname) {
    try {
        // Try to connect to the server without selecting a database first
        $conn = new mysqli($host, $user, $password);
        
        if ($conn->connect_error) {
            return [
                'success' => false,
                'message' => 'Connection to server failed: ' . $conn->connect_error,
                'details' => null
            ];
        }
        
        // Test if database exists
        $dbExists = $conn->select_db($dbname);
        
        if (!$dbExists) {
            return [
                'success' => false,
                'message' => "Connected to server, but database '$dbname' does not exist",
                'server_info' => $conn->server_info,
                'details' => null
            ];
        }
        
        // Test querying a table (using a common table name)
        try {
            $result = $conn->query("SHOW TABLES");
            $tables = [];
            
            if ($result) {
                while ($row = $result->fetch_array()) {
                    $tables[] = $row[0];
                }
            }
            
            return [
                'success' => true,
                'message' => "Successfully connected to database '$dbname'",
                'server_info' => $conn->server_info,
                'tables' => $tables,
                'details' => [
                    'host' => $host,
                    'user' => $user,
                    'database' => $dbname
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => "Connected to database, but couldn't query tables: " . $e->getMessage(),
                'server_info' => $conn->server_info,
                'details' => null
            ];
        }
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'details' => null
        ];
    }
}

// Run the test
$result = testDatabaseConnection($host, $user, $password, $dbname);

// Output the result as JSON
echo json_encode($result, JSON_PRETTY_PRINT);
?>
