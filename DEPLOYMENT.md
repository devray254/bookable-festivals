
# Maabara Events Platform - Live Server Deployment Guide

## Pre-Deployment Checklist

- [ ] Back up any existing data
- [ ] Verify server meets system requirements
- [ ] Prepare database credentials
- [ ] Test application locally with mock data

## Server Requirements

- [ ] PHP 7.4+ with extensions: mysqli, json, gd
- [ ] MySQL 5.7+
- [ ] Apache or Nginx web server
- [ ] SSL certificate (recommended for security and payment processing)

## Deployment Steps

### 1. Database Setup

- [ ] Access your MySQL server via phpMyAdmin or command line
- [ ] Create a new database called `maabara_events` (or your preferred name)
- [ ] Import the SQL file from `api/setup/install-database.sql`
- [ ] Verify all tables were created successfully
- [ ] Update the admin user password to a secure password

```sql
UPDATE users SET password = 'your-secure-password' WHERE email = 'admin@maabara.co.ke';
```

### 2. API Backend Setup

- [ ] Create a database configuration file at `api/db-config.php`:

```php
<?php
// Database connection settings
define('DB_HOST', 'your-database-host');
define('DB_USER', 'your-database-username');
define('DB_PASSWORD', 'your-database-password');
define('DB_NAME', 'maabara_events');

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set
$conn->set_charset("utf8mb4");
?>
```

- [ ] Upload all PHP files to your server's API directory
- [ ] Set appropriate file permissions:
```
chmod 644 *.php
chmod 755 */
```

### 3. Frontend Build and Deployment

- [ ] Update the API base URL in `src/utils/db-connection.ts` if necessary:
```typescript
// Base URL for API endpoints - empty for relative path in production
const API_BASE_URL = ''; // Update this if your API is not in the same domain
```

- [ ] Build the React application:
```
npm run build
```

- [ ] Upload the contents of the `dist/` directory to the web server root
- [ ] Configure your web server to handle client-side routing

#### Apache Configuration (.htaccess)

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx Configuration

```
location / {
  try_files $uri $uri/ /index.html;
}
```

### 4. Security Configuration

- [ ] Enable HTTPS for all traffic
- [ ] Set up appropriate CORS headers in your API:

```php
// Add to the top of each PHP file
header("Access-Control-Allow-Origin: https://your-domain.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
```

- [ ] Implement rate limiting on API endpoints
- [ ] Set up proper error handling and logging
- [ ] Secure sensitive files with .htaccess or Nginx rules

### 5. M-Pesa Integration Setup

For live M-Pesa integration:

1. [ ] Register for a Safaricom Developer account
2. [ ] Apply for Lipa Na M-Pesa Online API access
3. [ ] Update M-Pesa settings in the admin dashboard:
   - [ ] Change environment to "production"
   - [ ] Update Consumer Key and Secret
   - [ ] Update Shortcode to production values
   - [ ] Configure proper callback URL

### 6. Testing

- [ ] Test user registration and login
- [ ] Test event browsing and booking
- [ ] Test payment processing
- [ ] Test certificate generation
- [ ] Test admin dashboard functionality
- [ ] Verify mobile responsiveness

### 7. Post-Deployment

- [ ] Remove or secure setup files (like `import-database.php`)
- [ ] Create additional admin accounts as needed
- [ ] Document any server-specific configurations
- [ ] Set up regular backups
- [ ] Configure monitoring for critical functions

## Troubleshooting Common Issues

- **White screen/500 error**: Check PHP error logs
- **Database connection fails**: Verify credentials and MySQL server status
- **API endpoints return errors**: Check PHP version and required extensions
- **Client-side routing issues**: Verify .htaccess or Nginx configuration
- **Authentication problems**: Clear localStorage in browser and retry

## Production Maintenance

- **Database Backups**: Set up automated daily backups
- **Logs Rotation**: Configure log rotation for PHP/server logs
- **Updates**: Regularly check for security updates
- **Monitoring**: Set up uptime and performance monitoring

## Contact Support

If you encounter issues during deployment, please contact:
- Technical Support: support@maabara.co.ke
- Developer Team: dev@maabara.co.ke
