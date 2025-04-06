# Maabara Events Platform - Deployment Guide

This guide will help you deploy the Maabara Events platform on your server.

## Prerequisites

- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- The following PHP extensions:
  - mysqli
  - json
  - gd
  - mbstring
  - curl

## Deployment Steps

### 1. Upload Files

Upload all files to your web server's public directory.

### 2. Set Permissions

Make sure the following directories and files have appropriate permissions:

```bash
chmod 755 api/uploads
chmod 755 api/certificates
chmod 644 api/*.php
```

### 3. Create Configuration File

Create a `config.php` file in the `api` directory with your database credentials:

```php
<?php
// Database configuration settings
$DB_HOST = 'your_database_host';
$DB_USER = 'your_database_username';
$DB_PASSWORD = 'your_database_password';
$DB_NAME = 'maabara_events';

// Other configuration
$DEBUG_MODE = false; // Set to true for debugging
?>
```

### 4. Run the Setup Script

Navigate to the setup script in your browser:

```
https://your-domain.com/api/setup/deploy.php
```

Follow the instructions on the screen to complete the setup process:
- Check system requirements
- Install the database
- Create the admin account

### 5. Secure Your Installation

After setup is complete:

1. Delete or restrict access to the setup files:
   ```bash
   rm -rf api/setup
   ```

2. Make sure sensitive files are protected with .htaccess rules:
   ```
   <FilesMatch "^(config\.php|db-config\.php|.*\.sql)$">
       Order allow,deny
       Deny from all
   </FilesMatch>
   ```

3. Update the admin password through the admin dashboard.

### 6. Configure Additional Settings

Log in to the admin dashboard to configure:
- M-Pesa payment settings
- Email certificate delivery
- Site information and appearance

## Production Optimizations

For the best performance in production:

1. Enable HTTPS for secure communication
2. Configure proper caching for static assets
3. Set up database backups
4. Implement logging and monitoring

## Updating the Application

When updating to a new version:

1. Backup your database and configuration files
2. Upload the new files
3. Run any database migrations if provided

## Troubleshooting

If you encounter issues during deployment:

- Check PHP error logs
- Verify database connection settings
- Ensure all required PHP extensions are installed
- Check file permissions

## Support

For additional help, please contact support@maabara.co.ke
