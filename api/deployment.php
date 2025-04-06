
<?php
// Set headers for HTML response
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Maabara Events - Deployment Status</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        h1, h2 {
            color: #333;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
        .warning {
            color: orange;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow: auto;
        }
        .step {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #eee;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }
        .btn-danger {
            background-color: #f44336;
        }
    </style>
</head>
<body>
    <h1>Maabara Events - Deployment Status</h1>
    
    <div class="container">
        <h2>System Information</h2>
        <p><strong>PHP Version:</strong> <?php echo phpversion(); ?></p>
        <p><strong>MySQL Client Version:</strong> <?php echo function_exists('mysqli_get_client_info') ? mysqli_get_client_info() : 'Not available'; ?></p>
        <p><strong>Server Software:</strong> <?php echo $_SERVER['SERVER_SOFTWARE']; ?></p>
        <p><strong>Document Root:</strong> <?php echo $_SERVER['DOCUMENT_ROOT']; ?></p>
        <p><strong>Deployment Time:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
    </div>
    
    <div class="container">
        <h2>Deployment Checklist</h2>
        
        <div class="step">
            <h3>1. Database Configuration</h3>
            <?php
            // Check if db-config.php exists
            if (file_exists('db-config.php')) {
                echo "<p class='success'>✓ db-config.php exists</p>";
                
                // Try to include and check database connection
                try {
                    include_once 'db-config.php';
                    
                    if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
                        echo "<p class='success'>✓ Database connection successful</p>";
                        
                        // Check database version
                        $result = $conn->query("SELECT VERSION() as version");
                        if ($result) {
                            $row = $result->fetch_assoc();
                            echo "<p><strong>MySQL Server Version:</strong> " . $row['version'] . "</p>";
                        }
                    } else {
                        echo "<p class='error'>✗ Database connection failed. Please check your credentials.</p>";
                    }
                } catch (Exception $e) {
                    echo "<p class='error'>✗ Error testing database connection: " . $e->getMessage() . "</p>";
                }
            } else {
                echo "<p class='error'>✗ db-config.php not found. Please create this file with your database credentials.</p>";
                echo "<pre>
&lt;?php
// Database configuration
define('DB_HOST', 'your_database_host');
define('DB_USER', 'your_database_username');
define('DB_PASSWORD', 'your_database_password');
define('DB_NAME', 'maabara_events');

// Create connection
\$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if (\$conn->connect_error) {
    die(\"Connection failed: \" . \$conn->connect_error);
}

// Set character set
\$conn->set_charset(\"utf8mb4\");
?&gt;
</pre>";
            }
            ?>
        </div>
        
        <div class="step">
            <h3>2. API Endpoints</h3>
            <?php
            // List of required API files
            $requiredFiles = [
                'create-booking.php',
                'check-payment.php',
                'get-certificate.php',
                'log-activity.php',
                'mpesa-auth.php',
                'mpesa-stkpush.php'
            ];
            
            $missingFiles = [];
            foreach ($requiredFiles as $file) {
                if (!file_exists($file)) {
                    $missingFiles[] = $file;
                }
            }
            
            if (empty($missingFiles)) {
                echo "<p class='success'>✓ All required API endpoint files exist</p>";
            } else {
                echo "<p class='error'>✗ Some API endpoint files are missing:</p>";
                echo "<ul>";
                foreach ($missingFiles as $file) {
                    echo "<li>$file</li>";
                }
                echo "</ul>";
            }
            ?>
        </div>
        
        <div class="step">
            <h3>3. File Permissions</h3>
            <?php
            // Check uploads directory
            $uploadsDir = 'uploads';
            if (!file_exists($uploadsDir)) {
                echo "<p class='warning'>⚠ Uploads directory does not exist. Creating it now...</p>";
                if (mkdir($uploadsDir, 0755)) {
                    echo "<p class='success'>✓ Created uploads directory</p>";
                } else {
                    echo "<p class='error'>✗ Failed to create uploads directory</p>";
                }
            } elseif (!is_writable($uploadsDir)) {
                echo "<p class='error'>✗ Uploads directory exists but is not writable</p>";
                echo "<p>Please run: <code>chmod 755 $uploadsDir</code></p>";
            } else {
                echo "<p class='success'>✓ Uploads directory exists and is writable</p>";
            }
            
            // Check certificates directory
            $certsDir = 'certificates';
            if (!file_exists($certsDir)) {
                echo "<p class='warning'>⚠ Certificates directory does not exist. Creating it now...</p>";
                if (mkdir($certsDir, 0755)) {
                    echo "<p class='success'>✓ Created certificates directory</p>";
                } else {
                    echo "<p class='error'>✗ Failed to create certificates directory</p>";
                }
            } elseif (!is_writable($certsDir)) {
                echo "<p class='error'>✗ Certificates directory exists but is not writable</p>";
                echo "<p>Please run: <code>chmod 755 $certsDir</code></p>";
            } else {
                echo "<p class='success'>✓ Certificates directory exists and is writable</p>";
            }
            ?>
        </div>
        
        <div class="step">
            <h3>4. Security Checks</h3>
            <?php
            // Check if sensitive files are accessible
            $sensitiveFiles = [
                'db-config.php' => '/db-config.php',
                'database.sql' => '/database.sql'
            ];
            
            foreach ($sensitiveFiles as $file => $path) {
                $url = 'http' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 's' : '') . 
                       '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . $path;
                
                // Create a stream context that ignores SSL errors
                $context = stream_context_create([
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                    ],
                ]);
                
                // Try to access the file
                $headers = @get_headers($url, 0, $context);
                
                if ($headers && strpos($headers[0], '200') !== false) {
                    echo "<p class='error'>✗ Security issue: $file is publicly accessible!</p>";
                    echo "<p>Please restrict access to this file using .htaccess or similar methods.</p>";
                } else {
                    echo "<p class='success'>✓ $file is not publicly accessible</p>";
                }
            }
            
            // Check for .htaccess file
            if (!file_exists('.htaccess')) {
                echo "<p class='warning'>⚠ No .htaccess file found. This is recommended for security.</p>";
                echo "<p>Consider adding an .htaccess file with the following content:</p>";
                echo "<pre>
# Deny access to sensitive files
&lt;FilesMatch \"^(db-config\.php|database\.sql|.*\.sql|deployment\.php)$\"&gt;
    Order allow,deny
    Deny from all
&lt;/FilesMatch&gt;

# Protect directory listing
Options -Indexes

# Enable rewrite engine for frontend routing
&lt;IfModule mod_rewrite.c&gt;
    RewriteEngine On
    RewriteBase /
    
    # Allow direct access to API endpoints
    RewriteCond %{REQUEST_URI} !^/api/
    
    # If the request is not for an existing file or directory
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Rewrite all other requests to the index.html
    RewriteRule ^ index.html [L]
&lt;/IfModule&gt;
</pre>";
            } else {
                echo "<p class='success'>✓ .htaccess file exists</p>";
            }
            ?>
        </div>
    </div>
    
    <div class="container">
        <h2>Database Management</h2>
        
        <p><strong>Warning:</strong> These actions will modify your database. Use with caution!</p>
        
        <form method="post" action="import-database.php" onsubmit="return confirm('This will import the database structure and may overwrite existing data. Continue?');">
            <button type="submit" name="import" value="yes">Import Database Structure</button>
        </form>
        
        <p style="margin-top: 20px;"><strong>Remove demo data:</strong> Use this option when going to production</p>
        <form method="post" action="clean-database.php" onsubmit="return confirm('This will remove all demo data but keep the database structure and admin user. Continue?');">
            <button type="submit" class="btn-danger" name="clean" value="yes">Clean Demo Data</button>
        </form>
    </div>
    
    <div class="container">
        <h2>Next Steps</h2>
        
        <ol>
            <li>Ensure your database credentials are correctly set in <code>db-config.php</code></li>
            <li>Import the database structure using the button above</li>
            <li>Configure M-Pesa settings in the admin dashboard</li>
            <li>Update the admin password</li>
            <li>Test the application thoroughly before going live</li>
            <li>When ready for production, remove this deployment file</li>
        </ol>
        
        <p class="warning"><strong>Important:</strong> Delete this deployment file after completing setup!</p>
    </div>
    
    <p style="text-align:center; margin-top: 40px;">
        <a href="/">&laquo; Back to Application</a>
    </p>
</body>
</html>
