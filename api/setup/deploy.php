
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
$configTemplate = file_exists('config-template.php') ? file_get_contents('config-template.php') : false;

// Check if uploads directory exists and is writable
$uploadsDir = '../uploads';
$uploadsDirExists = is_dir($uploadsDir);
$uploadsDirWritable = $uploadsDirExists && is_writable($uploadsDir);

// Check if certificates directory exists and is writable
$certsDir = '../certificates';
$certsDirExists = is_dir($certsDir);
$certsDirWritable = $certsDirExists && is_writable($certsDir);

// Check if database SQL file exists
$sqlFileExists = file_exists('install-database.sql');

// Create directories if they don't exist
if (!$uploadsDirExists) {
    mkdir($uploadsDir, 0755, true);
    $uploadsDirExists = true;
    $uploadsDirWritable = is_writable($uploadsDir);
}

if (!$certsDirExists) {
    mkdir($certsDir, 0755, true);
    $certsDirExists = true;
    $certsDirWritable = is_writable($certsDir);
}

// Check if we're running on localhost or production
$isLocalhost = in_array($_SERVER['SERVER_ADDR'], ['127.0.0.1', '::1']) || 
               strpos($_SERVER['HTTP_HOST'], 'localhost') !== false;

// Generate sample config if it doesn't exist
if (!$configExists && $configTemplate) {
    $defaultConfig = str_replace(
        ['your_database_username', 'your_database_password', 'https://your-domain.com'],
        [$isLocalhost ? 'root' : 'db_user', $isLocalhost ? '' : 'strong_password', 'https://' . $_SERVER['HTTP_HOST']],
        $configTemplate
    );
    file_put_contents('../config-sample.php', $defaultConfig);
}

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
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
            margin-right: 10px;
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
        .btn-success {
            background-color: #2e7d32;
        }
        .btn-success:hover {
            background-color: #1b5e20;
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
        .step {
            background-color: #e0f2f1;
            border-left: 4px solid #26a69a;
            padding: 10px 15px;
            margin-bottom: 10px;
        }
        .step-number {
            font-weight: bold;
            margin-right: 5px;
        }
        .step-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .progress-bar {
            background-color: #e0e0e0;
            border-radius: 4px;
            height: 20px;
            margin-bottom: 10px;
            overflow: hidden;
        }
        .progress {
            background-color: #1a56db;
            height: 100%;
            text-align: center;
            color: white;
            line-height: 20px;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table th, table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        table th {
            background-color: #f5f5f5;
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
        
        <?php 
        // Calculate progress percentage
        $checks = 4; // PHP version, extensions, directories, config
        $passed = $phpVersionCheck ? 1 : 0;
        $passed += empty($missingExtensions) ? 1 : 0;
        $passed += ($uploadsDirExists && $uploadsDirWritable && $certsDirExists && $certsDirWritable) ? 1 : 0;
        $passed += $configExists ? 1 : 0;
        $progress = round(($passed / $checks) * 100);
        ?>
        
        <div class="progress-bar">
            <div class="progress" style="width: <?php echo $progress; ?>%"><?php echo $progress; ?>%</div>
        </div>
        
        <div class="step">
            <div class="step-title"><span class="step-number">1.</span> PHP Version</div>
            <?php if ($phpVersionCheck): ?>
                <span class="success">✓ PHP <?php echo PHP_VERSION; ?> (Required: <?php echo $requiredPhpVersion; ?>)</span>
            <?php else: ?>
                <span class="error">✗ PHP <?php echo PHP_VERSION; ?> (Required: <?php echo $requiredPhpVersion; ?> or higher)</span>
                <p>Please upgrade your PHP version to continue.</p>
            <?php endif; ?>
        </div>

        <div class="step">
            <div class="step-title"><span class="step-number">2.</span> PHP Extensions</div>
            <?php if (empty($missingExtensions)): ?>
                <span class="success">✓ All required extensions are installed</span>
            <?php else: ?>
                <span class="error">✗ Missing extensions: <?php echo implode(', ', $missingExtensions); ?></span>
                <p>Please install the missing PHP extensions to continue.</p>
            <?php endif; ?>
        </div>

        <div class="step">
            <div class="step-title"><span class="step-number">3.</span> Required Directories</div>
            <p>
                <strong>Uploads Directory:</strong> 
                <?php if ($uploadsDirExists && $uploadsDirWritable): ?>
                    <span class="success">✓ Exists and is writable</span>
                <?php elseif ($uploadsDirExists): ?>
                    <span class="error">✗ Exists but is not writable</span>
                    <p>Run: <code>chmod 755 <?php echo $uploadsDir; ?></code></p>
                <?php else: ?>
                    <span class="error">✗ Does not exist</span>
                    <p>Run: <code>mkdir <?php echo $uploadsDir; ?> && chmod 755 <?php echo $uploadsDir; ?></code></p>
                <?php endif; ?>
            </p>
            <p>
                <strong>Certificates Directory:</strong> 
                <?php if ($certsDirExists && $certsDirWritable): ?>
                    <span class="success">✓ Exists and is writable</span>
                <?php elseif ($certsDirExists): ?>
                    <span class="error">✗ Exists but is not writable</span>
                    <p>Run: <code>chmod 755 <?php echo $certsDir; ?></code></p>
                <?php else: ?>
                    <span class="error">✗ Does not exist</span>
                    <p>Run: <code>mkdir <?php echo $certsDir; ?> && chmod 755 <?php echo $certsDir; ?></code></p>
                <?php endif; ?>
            </p>
        </div>

        <div class="step">
            <div class="step-title"><span class="step-number">4.</span> Configuration File</div>
            <?php if ($configExists): ?>
                <span class="success">✓ config.php exists</span>
            <?php else: ?>
                <span class="error">✗ config.php is missing</span>
                <div>
                    <p>Create a file named <code>config.php</code> in the api directory with the following content:</p>
                    <p>A sample configuration file has been created for you at <code>api/config-sample.php</code>.</p>
                    <p>Please rename it to <code>config.php</code> and update the values as needed.</p>
                    <?php if (file_exists('../config-sample.php')): ?>
                        <a href="../config-sample.php" target="_blank" class="btn">View Sample Config</a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <div class="card">
        <h2>Database Setup</h2>
        <?php if (!$configExists): ?>
            <p class="warning">⚠️ You need to create config.php before installing the database.</p>
        <?php elseif (!$sqlFileExists): ?>
            <p class="error">✗ SQL installation file is missing</p>
        <?php else: ?>
            <p>Click the button below to install the database structure and initial data.</p>
            <p><strong>Warning:</strong> If a database with the same name already exists, this will modify its structure but preserve existing data.</p>
            <a href="install-db.php" class="btn btn-success">Install Database</a>
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
        
        <?php if ($configExists && empty($missingExtensions) && $sqlFileExists): ?>
            <div class="step">
                <div class="step-title">Final Step: Secure Your Installation</div>
                <p>After completing the setup, you should delete or restrict access to the setup directory.</p>
                <p>You can do this by adding the following to your .htaccess file:</p>
                <pre>&lt;Files "deploy.php"&gt;
    Require all denied
&lt;/Files&gt;</pre>
                <p>Or by deleting the setup directory entirely after deployment.</p>
            </div>
        <?php endif; ?>
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
            <?php if ($configExists && empty($missingExtensions) && $progress == 100): ?>
                <a href="../" class="btn">Go to Application</a>
                <a href="../admin/" class="btn">Admin Dashboard</a>
                <?php if ($isLocalhost): ?>
                    <p class="warning">⚠️ You are running in a development environment. Some features may not work properly.</p>
                <?php endif; ?>
            <?php else: ?>
                <p class="warning">⚠️ Please complete all setup steps before accessing the application.</p>
            <?php endif; ?>
        </p>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>Maabara Events Platform v1.0</p>
        <p><small>Deployment timestamp: <?php echo date('Y-m-d H:i:s'); ?></small></p>
    </div>
</body>
</html>
