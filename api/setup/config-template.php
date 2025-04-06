<?php
// Database configuration settings - KEEP SECRET!
// This file is a template for config.php

// Database connection settings
$DB_HOST = 'localhost';      // Usually 'localhost' or database server address
$DB_USER = 'your_database_username';  // Database username 
$DB_PASSWORD = 'your_database_password';  // Database password
$DB_NAME = 'maabara_events';  // Database name

// Other configuration
$DEBUG_MODE = false; // Set to true to enable verbose error messages

// Site configuration
$SITE_NAME = 'Maabara Events';
$SITE_URL = 'https://your-domain.com';
$ADMIN_EMAIL = 'admin@example.com';

// Security settings
$SESSION_LIFETIME = 86400; // 24 hours in seconds
$TOKEN_LIFETIME = 3600; // 1 hour in seconds
$SALT = 'change_this_to_a_random_string'; // Used for password hashing

// File upload settings
$MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
$ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'];

// Payment settings
$MPESA_ENABLED = true;
$MPESA_ENVIRONMENT = 'sandbox'; // 'sandbox' or 'production'

// Email settings
$EMAIL_ENABLED = true;
$EMAIL_FROM = 'noreply@example.com';
$EMAIL_NAME = 'Maabara Events';

// Deployment settings
$MAINTENANCE_MODE = false; // Set to true during maintenance
$INSTALLATION_COMPLETE = false; // Set to true after successful installation
?>
