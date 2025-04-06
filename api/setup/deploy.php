<?php
// Deployment script for setting up the Maabara Events platform

// Set error reporting for debugging during setup
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check PHP version
$requiredPhpVersion = '7.4.0';
$phpVersionCheck = version_compare(PHP_VERSION, $requiredPhpVersion, '>=');

// Check for required extensions
$requiredExtensions = ['mysqli', 'json', 'gd', 'mbstring', 'curl'];
$missingExtensions = [];
foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}

// Check if config.php exists
$configExists = file_exists('../config.php');

// Check if uploads directory exists and is writable
$uploadsDir = '../uploads';
$uploadsDirExists = is_dir($uploadsDir);
$uploadsDirWritable = $uploadsDirExists && is_writable($uploadsDir);

// Generate output
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maabara Events - Deployment Tool</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            background-color: #1a56db;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .success {
            color: #2e7d32;
        }
        .error {
            color: #c62828;
        }
        .warning {
            color: #f57c00;
        }
        .btn {
            display: inline-block;
            background-color: #1a56db;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .btn:hover {
            background-color: #1e40af;
        }
        .btn-danger {
            background-color: #c62828;
        }
        .btn-danger:hover {
            background-color: #b71c1c;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow: auto;
        }
        code {
            font-family: Consolas, Monaco, 'Andale Mono', monospace;
            background-color: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Maabara Events - Deployment Tool</h1>
        <p>This tool helps you set up the Maabara Events platform on your server.</p>
    </div>

    <div class="card">
        <h2>System Requirements Check</h2>
        
        <p>
            <strong>PHP Version:</strong> 
            <?php if ($phpVersionCheck): ?>
                <span class="success">✓ PHP <?php echo PHP_VERSION; ?> (Required: <?php echo $requiredPhpVersion; ?>)</span>
            <?php else: ?>
                <span class="error">✗ PHP <?php echo PHP_VERSION; ?> (Required: <?php echo $requiredPhpVersion; ?> or higher)</span>
            <?php endif; ?>
        </p>

        <p>
            <strong>PHP Extensions:</strong> 
            <?php if (empty($missingExtensions)): ?>
                <span class="success">✓ All required extensions are installed</span>
            <?php else: ?>
                <span class="error">✗ Missing extensions: <?php echo implode(', ', $missingExtensions); ?></span>
            <?php endif; ?>
        </p>

        <p>
            <strong>Configuration File:</strong> 
            <?php if ($configExists): ?>
                <span class="success">✓ config.php exists</span>
            <?php else: ?>
                <span class="error">✗ config.php is missing</span>
                <div>
                    <p>Create a file named <code>config.php</code> in the api directory with the following content:</p>
                    <pre>
&lt;?php
// Database configuration settings - KEEP SECRET!
// This file is included by db-config.php but not directly exposed

// Database connection settings
$DB_HOST = 'localhost';
$DB_USER = 'your_database_username';
$DB_PASSWORD = 'your_database_password';
$DB_NAME = 'maabara_events';

// Other configuration
$DEBUG_MODE = false; // Set to true to enable verbose error messages
?&gt;</pre>
                </div>
            <?php endif; ?>
        </p>

        <p>
            <strong>Uploads Directory:</strong> 
            <?php if ($uploadsDirExists && $uploadsDirWritable): ?>
                <span class="success">✓ Uploads directory exists and is writable</span>
            <?php elseif ($uploadsDirExists): ?>
                <span class="error">✗ Uploads directory exists but is not writable</span>
                <p>Run: <code>chmod 755 <?php echo $uploadsDir; ?></code></p>
            <?php else: ?>
                <span class="error">✗ Uploads directory does not exist</span>
                <p>Run: <code>mkdir <?php echo $uploadsDir; ?> && chmod 755 <?php echo $uploadsDir; ?></code></p>
            <?php endif; ?>
        </p>
    </div>

    <div class="card">
        <h2>Database Setup</h2>
        <?php if (!$configExists): ?>
            <p class="warning">⚠️ You need to create config.php before installing the database.</p>
        <?php else: ?>
            <p>Click the button below to install the database structure and initial data.</p>
            <p><strong>Warning:</strong> If a database with the same name already exists, this will modify its structure but preserve existing data.</p>
            <a href="install-db.php" class="btn">Install Database</a>
        <?php endif; ?>
    </div>

    <div class="card">
        <h2>Security Recommendations</h2>
        <ul>
            <li>Secure your <code>config.php</code> file from direct access</li>
            <li>Enable HTTPS for secure communication</li>
            <li>Set up proper error handling and logging</li>
            <li>Update the admin password after installation</li>
            <li>Consider using a separate database user with limited permissions</li>
            <li>Remove or secure setup scripts after deployment</li>
        </ul>
    </div>

    <div class="card">
        <h2>Next Steps</h2>
        <ol>
            <li>Configure M-Pesa settings in the admin dashboard</li>
            <li>Set up email delivery for certificates</li>
            <li>Customize the site appearance</li>
            <li>Create your first event</li>
            <li>Test the booking process</li>
        </ol>
        
        <p>
            <a href="../" class="btn">Go to Application</a>
            <a href="../admin/" class="btn">Admin Dashboard</a>
        </p>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>Maabara Events Platform v1.0</p>
    </div>
</body>
</html>
