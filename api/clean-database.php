<?php
// Set headers for JSON response (or HTML if viewed directly)
header('Content-Type: text/html');

// Include database connection
require_once 'db-config.php';

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['clean']) && $_POST['clean'] === 'yes') {
    try {
        // Start transaction
        $conn->begin_transaction();
        
        // Tables to clean (in correct order to avoid foreign key constraint errors)
        $tables = [
            'certificates',
            'payments',
            'payment_logs',
            'bookings',
            'events',
            'activity_logs'
        ];
        
        // Track results
        $results = [];
        
        // Clean tables but preserve structure
        foreach ($tables as $table) {
            $sql = "DELETE FROM $table WHERE id > 0";
            if ($conn->query($sql)) {
                $results[$table] = [
                    'status' => 'success',
                    'message' => "Table $table cleaned successfully"
                ];
            } else {
                $results[$table] = [
                    'status' => 'error',
                    'message' => "Error cleaning table $table: " . $conn->error
                ];
                // If any error, rollback everything
                $conn->rollback();
                break;
            }
        }
        
        // Clean users table but keep admin
        $sqlUsers = "DELETE FROM users WHERE role != 'admin'";
        if ($conn->query($sqlUsers)) {
            $results['users'] = [
                'status' => 'success',
                'message' => "Users table cleaned (kept admin users)"
            ];
        } else {
            $results['users'] = [
                'status' => 'error',
                'message' => "Error cleaning users table: " . $conn->error
            ];
            $conn->rollback();
        }
        
        // Reset auto increment values
        foreach ($tables as $table) {
            if ($table !== 'payments' && $table !== 'certificates') { // Skip tables with non-auto-increment IDs
                $sql = "ALTER TABLE $table AUTO_INCREMENT = 1";
                $conn->query($sql);
            }
        }
        
        // If we got here without errors, commit the transaction
        $conn->commit();
        
        // Output results in HTML
        echo '<!DOCTYPE html>
        <html>
        <head>
            <title>Database Cleanup</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                .success { color: green; }
                .error { color: red; }
                .container { border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>Database Cleanup Results</h1>
            
            <div class="container">';
        
        // Check if any errors occurred
        $hasErrors = false;
        foreach ($results as $result) {
            if ($result['status'] === 'error') {
                $hasErrors = true;
                break;
            }
        }
        
        if ($hasErrors) {
            echo '<h2 class="error">Cleanup failed</h2>
                  <p>Errors occurred during the cleanup process. All changes have been rolled back.</p>';
        } else {
            echo '<h2 class="success">Cleanup successful</h2>
                  <p>All demo data has been removed successfully. The database structure and admin user have been preserved.</p>';
        }
        
        echo '<h3>Details:</h3>
              <ul>';
        
        foreach ($results as $table => $result) {
            $class = $result['status'] === 'success' ? 'success' : 'error';
            echo "<li class=\"$class\">{$result['message']}</li>";
        }
        
        echo '</ul>
            </div>
            
            <p><a href="deployment.php">&laquo; Back to Deployment Tools</a></p>
        </body>
        </html>';
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        
        echo '<!DOCTYPE html>
        <html>
        <head>
            <title>Database Cleanup</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                .error { color: red; }
                .container { border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>Database Cleanup Error</h1>
            
            <div class="container">
                <h2 class="error">Cleanup failed</h2>
                <p>An unexpected error occurred: ' . $e->getMessage() . '</p>
                <p>All changes have been rolled back.</p>
            </div>
            
            <p><a href="deployment.php">&laquo; Back to Deployment Tools</a></p>
        </body>
        </html>';
    }
} else {
    // If accessed directly without POST request
    echo '<!DOCTYPE html>
    <html>
    <head>
        <title>Database Cleanup</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .warning { color: orange; }
            .container { border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
            button { background-color: #f44336; color: white; border: none; padding: 10px 15px; text-align: center; 
                    text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; 
                    border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>Database Cleanup Tool</h1>
        
        <div class="container">
            <h2 class="warning">Warning</h2>
            <p>This tool will remove all demo data from your database. Only the database structure and admin user will be preserved.</p>
            <p><strong>This action cannot be undone!</strong></p>
            
            <form method="post" onsubmit="return confirm(\'This will remove all demo data. Are you sure you want to continue?\');">
                <button type="submit" name="clean" value="yes">Clean Demo Data</button>
            </form>
        </div>
        
        <p><a href="deployment.php">&laquo; Back to Deployment Tools</a></p>
    </body>
    </html>';
}

// Close connection
$conn->close();
?>
