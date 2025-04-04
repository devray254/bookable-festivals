
# Maabara Events Platform

A comprehensive event management platform for scientific and educational events with M-Pesa payment integration and certificate generation capabilities.

## Features

- Event browsing and registration
- M-Pesa payment integration
- PDF certificate generation
- Admin dashboard
- User management
- Event management
- Bookings and payments tracking
- Activity logging

## Setup Instructions for Live Server

### Prerequisites

- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Node.js (for development)

### Database Setup

1. **Import the database**:
   - Upload the `api/database-with-mock-data.sql` file to your server
   - Create a new MySQL database named `maabara_events`
   - Import the SQL file into your database

   OR

   - Upload all files to your server
   - Navigate to `https://your-domain.com/api/import-database.php`
   - Follow the on-screen instructions to automatically set up the database

2. **Update database connection settings**:
   - Edit `api/db-connect.php` and update the database credentials:
   ```php
   $host = 'your-database-host';
   $user = 'your-database-username';
   $password = 'your-database-password';
   $dbname = 'maabara_events';
   ```

### Backend Setup

1. **Configure PHP**:
   - Make sure PHP is properly configured on your server
   - Required extensions: mysqli, json, gd

2. **Set up API endpoints**:
   - All API files are in the `api/` directory
   - Ensure these files are accessible via HTTP

### Frontend Setup

1. **Build the React application**:
   ```
   npm run build
   ```

2. **Deploy the built files**:
   - Upload the contents of the `dist/` directory to your web server
   - Configure your web server to serve the application correctly

3. **Update API base URL** (if needed):
   - If your API endpoints are on a different domain, update the API_BASE_URL in `src/utils/db-connection.ts`

### Test Credentials

- **Admin Login**:
  - Email: `admin@maabara.co.ke`
  - Password: `admin123`

- **Test User**:
  - Email: `john@example.com`
  - Password: `password123`

- **M-Pesa Sandbox Test**:
  - Phone: `254708374149`
  - PIN: `12345`
  - These are Safaricom's test credentials and won't work in production

## Development Setup

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Start the development server**:
   ```
   npm run dev
   ```

3. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

- `/api` - PHP backend files
- `/backend` - Node.js alternative backend (if used)
- `/src` - React frontend source code
  - `/components` - UI components
  - `/pages` - Page components
  - `/utils` - Utility functions and API clients
  - `/hooks` - Custom React hooks

## Troubleshooting

- **Database Connection Issues**:
  - Check your database credentials in `api/db-connect.php`
  - Ensure your MySQL server is running and accessible

- **API Endpoint Errors**:
  - Check PHP error logs for detailed information
  - Ensure all API files have correct permissions

- **Certificate Generation Issues**:
  - Make sure the GD library is enabled in PHP
  - Check that temp directories are writable

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2024 Maabara Online Limited
