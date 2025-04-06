<?php
// Database configuration settings - KEEP SECRET!
// This file is a template for config.php

// Database connection settings
$DB_HOST = 'localhost';
$DB_USER = 'your_database_username';
$DB_PASSWORD = 'your_database_password';
$DB_NAME = 'maabara_events';

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
$ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
?>
