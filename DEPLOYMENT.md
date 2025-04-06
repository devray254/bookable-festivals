
# Maabara Events Platform - Live Server Deployment Guide

## Pre-Deployment Checklist

- [ ] Back up any existing data
- [ ] Verify server meets system requirements
- [ ] Prepare database credentials
- [ ] Test application locally with mock data

## Server Requirements

- [ ] PHP 7.4+ with extensions: mysqli, json, gd, bcrypt
- [ ] MySQL 5.7+
- [ ] Apache or Nginx web server
- [ ] SSL certificate (required for security and payment processing)
- [ ] Sufficient disk space for user uploads and certificates (min. 1GB recommended)

## Deployment Steps

### 1. Database Setup

- [ ] Access your MySQL server via phpMyAdmin or command line
- [ ] Create a new database called `maabara_events` (or your preferred name)
- [ ] Import the SQL file from `api/database-with-mock-data.sql`
- [ ] Verify all tables were created successfully
- [ ] Update the admin user password to a secure password

```sql
UPDATE users SET password = '$2y$10$YourHashedPasswordHere' WHERE email = 'admin@maabara.co.ke';
```

> Note: Make sure to use proper password hashing (bcrypt) when updating passwords

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
chmod 755 uploads/
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

# Protect sensitive files
<FilesMatch "^\.env|config\.php|composer\.json|package\.json|package-lock\.json">
  Order allow,deny
  Deny from all
</FilesMatch>

# Enable compression for better performance
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set caching headers for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
</IfModule>
```

#### Nginx Configuration

```
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    root /path/to/your/dist/folder;
    index index.html;
    
    # API location
    location /api {
        try_files $uri $uri/ /api/index.php?$query_string;
        
        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
            fastcgi_read_timeout 300;
        }
    }
    
    # Handle React routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Restrict access to sensitive files
    location ~ /\.env|composer\.json|package\.json {
        deny all;
        return 404;
    }
    
    # Static asset caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### 4. Security Configuration

- [ ] Enable HTTPS for all traffic
- [ ] Set up appropriate CORS headers in your API:

```php
// Add to the top of each PHP file
header("Access-Control-Allow-Origin: https://your-domain.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
```

- [ ] Implement rate limiting on API endpoints
- [ ] Set up proper error handling and logging
- [ ] Secure sensitive files with .htaccess or Nginx rules
- [ ] Create a separate database user with limited permissions for the application
- [ ] Enable database query logging in production for at least 30 days
- [ ] Configure a firewall to restrict access to database ports

### 5. M-Pesa Integration Setup

For live M-Pesa integration:

1. [ ] Register for a Safaricom Developer account
2. [ ] Apply for Lipa Na M-Pesa Online API access
3. [ ] Update M-Pesa settings in the admin dashboard:
   - [ ] Change environment to "production"
   - [ ] Update Consumer Key and Secret
   - [ ] Update Shortcode to production values
   - [ ] Configure proper callback URL

### 6. Gmail Integration Setup

For email certificate delivery:

1. [ ] Create a Google Cloud Platform project
2. [ ] Enable the Gmail API
3. [ ] Create OAuth 2.0 credentials
4. [ ] Update Gmail settings in the admin dashboard:
   - [ ] Add Client ID and Client Secret
   - [ ] Configure sender email and name
   - [ ] Authenticate the application to get refresh token

### 7. Testing

- [ ] Test user registration and login
- [ ] Test event browsing and booking
- [ ] Test payment processing
- [ ] Test certificate generation and delivery
- [ ] Test admin dashboard functionality
- [ ] Verify mobile responsiveness
- [ ] Test webinar access functionality
- [ ] Test all form validations

#### Test Accounts

- Admin Login: admin@maabara.co.ke (password set during installation)
- Test User: john@example.com / password123 (for demonstration purposes only)

### 8. Post-Deployment

- [ ] Remove or secure setup files (like `import-database.php`)
- [ ] Create additional admin accounts as needed
- [ ] Document any server-specific configurations
- [ ] Set up regular backups
- [ ] Configure monitoring for critical functions
- [ ] Remove test/mock data before going live
- [ ] Set up email alerts for system errors

## Production Maintenance

- **Database Backups**: Set up automated daily backups
- **Logs Rotation**: Configure log rotation for PHP/server logs
- **Updates**: Regularly check for security updates
- **Monitoring**: Set up uptime and performance monitoring
- **Security Scans**: Perform regular vulnerability scans
- **SSL Certificates**: Monitor expiration dates and renew before expiry

## Troubleshooting Common Issues

- **White screen/500 error**: Check PHP error logs at /var/log/apache2/error.log or /var/log/nginx/error.log
- **Database connection fails**: Verify credentials and MySQL server status
- **API endpoints return errors**: Check PHP version and required extensions
- **Client-side routing issues**: Verify .htaccess or Nginx configuration
- **Authentication problems**: Clear localStorage in browser and retry
- **M-Pesa integration issues**: Verify API credentials and network connectivity
- **Email delivery problems**: Check Gmail API quota and authentication status

## Contact Support

If you encounter issues during deployment, please contact:
- Technical Support: support@maabara.co.ke
- Developer Team: dev@maabara.co.ke

## Version Information

- Current Version: 1.0.0
- Last Updated: 2025-04-06
- Developed by: Maabara Hub Africa LTD

