
# Maabara Events Platform - Live Server Deployment Checklist

## Pre-Deployment

- [ ] Back up any existing data
- [ ] Verify server meets system requirements
- [ ] Prepare database credentials
- [ ] Review and update API endpoints if necessary

## Server Requirements

- [ ] PHP 7.4+ with extensions: mysqli, json, gd
- [ ] MySQL 5.7+
- [ ] Apache or Nginx web server
- [ ] SSL certificate (recommended for secure M-Pesa transactions)

## Deployment Steps

### 1. Database Setup

- [ ] Create MySQL database `maabara_events`
- [ ] Import `api/database-with-mock-data.sql`
- [ ] Verify tables created successfully
- [ ] Confirm mock data is present

### 2. Backend Setup

- [ ] Upload all PHP files to server `/api` directory
- [ ] Update database credentials in `api/db-connect.php`:
  ```php
  $host = 'your-database-host';
  $user = 'your-database-username';
  $password = 'your-database-password';
  $dbname = 'maabara_events';
  ```
- [ ] Set appropriate file permissions:
  ```
  chmod 644 *.php
  chmod 755 */
  ```
- [ ] Test API endpoint: `/api/test-connection.php`

### 3. Frontend Setup

- [ ] Build the React application locally:
  ```
  npm run build
  ```
- [ ] Upload the contents of the `dist/` directory to server root
- [ ] Configure your web server to serve the application correctly
- [ ] Update API base URL if necessary in `src/utils/db-connection.ts`

### 4. Configuration

- [ ] Update M-Pesa credentials in admin dashboard
- [ ] Test M-Pesa integration with sandbox environment
- [ ] Configure any environment-specific settings
- [ ] Update contact details and other business information

### 5. Testing

- [ ] Test user registration and login
- [ ] Test event browsing and booking
- [ ] Test payment processing
- [ ] Test certificate generation and download
- [ ] Test admin dashboard functionality
- [ ] Verify mobile responsiveness

### 6. Security

- [ ] Ensure proper CORS configuration
- [ ] Validate input sanitization
- [ ] Check for secure password storage
- [ ] Verify proper authentication/authorization
- [ ] Enable HTTPS for all traffic

### 7. Monitoring

- [ ] Set up error logging
- [ ] Configure activity logging
- [ ] Set up backup schedule
- [ ] Implement monitoring for critical functions

## Post-Deployment

- [ ] Change default admin password
- [ ] Delete sensitive setup files (like `import-database.php`)
- [ ] Create additional admin accounts as needed
- [ ] Document any server-specific configurations

## Production M-Pesa Setup

When ready to go to production:

1. [ ] Register for Safaricom Developer account
2. [ ] Apply for Lipa Na M-Pesa Online API access
3. [ ] Update M-Pesa settings in admin dashboard:
   - [ ] Change environment to "production"
   - [ ] Update Consumer Key and Secret
   - [ ] Update Shortcode to production values
   - [ ] Configure proper callback URL

## Troubleshooting Common Issues

- **White screen/500 error**: Check PHP error logs
- **Database connection fails**: Verify credentials and MySQL server status
- **API endpoints return errors**: Check PHP version and required extensions
- **Certificate generation fails**: Verify GD library is enabled
- **M-Pesa integration issues**: Confirm API credentials and callback URL
