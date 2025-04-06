
# Maabara Events Platform - Deployment Guide

This comprehensive guide will help you deploy the Maabara Events platform on your server securely and efficiently.

## Prerequisites

- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Required PHP extensions:
  - mysqli
  - json
  - gd
  - mbstring
  - curl

## Quick Deployment Steps

Follow these steps for a quick deployment:

1. Upload all files to your web server
2. Create a `config.php` file in the `api` directory
3. Navigate to `https://your-domain.com/api/setup/deploy.php`
4. Follow the on-screen instructions to complete the setup
5. After setup, secure or remove the setup files

## Detailed Deployment Instructions

### 1. Server Preparation

Ensure your server meets all requirements before beginning:

```bash
# Check PHP version (should be 7.4 or higher)
php -v

# Check for required PHP extensions
php -m | grep -E 'mysqli|json|gd|mbstring|curl'

# Set proper file permissions
chmod 755 api/uploads
chmod 755 api/certificates
chmod 644 api/*.php
```

### 2. Database Configuration

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

### 3. Automated Setup Process

Navigate to the deployment tool in your browser:

```
https://your-domain.com/api/setup/deploy.php
```

The deployment tool will:
1. Check system requirements
2. Verify directory permissions
3. Create necessary directories if missing
4. Guide you through database installation
5. Provide next steps for configuration

### 4. Database Installation

Click the "Install Database" button on the deployment page to:
- Create the database (if it doesn't exist)
- Install all required tables
- Add initial data (categories, admin user)
- Configure default settings

### 5. Post-Installation Security

After completing setup:

1. **Secure sensitive files**:
   ```bash
   # Option 1: Delete setup directory (recommended for production)
   rm -rf api/setup

   # Option 2: Restrict access via .htaccess
   echo 'Require all denied' > api/setup/.htaccess
   ```

2. **Update default credentials**:
   - Log in to the admin dashboard
   - Change the default admin password immediately
   - Update M-Pesa and email settings

3. **Verify file permissions**:
   ```bash
   # Secure configuration files
   chmod 600 api/config.php
   
   # Ensure upload directories are writable
   chmod 755 api/uploads
   chmod 755 api/certificates
   ```

### 6. Web Server Configuration

#### Apache Configuration

Ensure your Apache configuration includes:

```apache
# Enable .htaccess files
<Directory /path/to/your/app>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

# Redirect all HTTP traffic to HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/your/app
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # Other recommended settings
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</VirtualHost>
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    root /path/to/your/app;
    index index.html index.php;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # API Location
    location /api {
        try_files $uri $uri/ /api/index.php?$query_string;
        
        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
            fastcgi_read_timeout 300;
        }
        
        # Protect sensitive files
        location ~ ^/api/(config\.php|.*\.sql|setup/) {
            deny all;
            return 404;
        }
    }
    
    # Handle React routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static asset caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### 7. Payment Integration (M-Pesa)

To set up M-Pesa integration:

1. Register for a Safaricom Developer account at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create a new app and obtain API credentials
3. Configure M-Pesa settings in the admin dashboard:
   - Consumer Key
   - Consumer Secret
   - Passkey
   - Shortcode
   - Environment (sandbox/production)
   - Callback URL

### 8. Email Configuration

For certificate delivery via email:

1. Configure email settings in the admin dashboard
2. Test email delivery functionality
3. Customize certificate templates as needed

### 9. Regular Maintenance

Implement these maintenance practices:

- **Database Backups**: Set up automated daily backups
  ```bash
  # Example backup script
  mysqldump -u username -p dbname > backup_$(date +%Y%m%d).sql
  ```

- **Log Rotation**: Ensure logs don't consume excessive space
  ```bash
  # Example logrotate configuration
  /var/log/apache2/*.log {
      weekly
      rotate 12
      compress
      delaycompress
      notifempty
      create 640 root adm
  }
  ```

- **Security Updates**: Regularly check for and apply updates
- **Performance Monitoring**: Monitor server resource usage

## Troubleshooting

### Database Connection Issues

If you experience database connection problems:

1. Verify database credentials in `config.php`
2. Check that the MySQL server is running
3. Ensure the database user has proper permissions
4. Check for firewall restrictions

```sql
-- Grant necessary permissions to database user
GRANT ALL PRIVILEGES ON maabara_events.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### File Permission Issues

If you encounter file permission errors:

```bash
# Set proper ownership
chown -R www-data:www-data /path/to/your/app

# Set proper permissions
find /path/to/your/app -type f -exec chmod 644 {} \;
find /path/to/your/app -type d -exec chmod 755 {} \;
chmod 755 /path/to/your/app/api/uploads
chmod 755 /path/to/your/app/api/certificates
```

### Payment Integration Issues

For M-Pesa integration problems:

1. Verify your API credentials
2. Ensure your callback URL is publicly accessible
3. Check the M-Pesa API status
4. Review transaction logs for specific error codes

## Support and Resources

For additional help with deployment:

- Contact technical support: support@maabara.co.ke
- Visit our documentation: [docs.maabara.co.ke](https://docs.maabara.co.ke)
- Report issues: [github.com/maabara/events-platform/issues](https://github.com/maabara/events-platform/issues)

## Version Information

- Current Version: 1.0.0
- Last Updated: 2025-04-06
- Maintained by: Maabara Hub Africa LTD
