
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS maabara_events;

-- Use the database
USE maabara_events;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    organization_type VARCHAR(50) NULL,
    reset_token VARCHAR(100) NULL,
    reset_token_expires DATETIME NULL,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    action VARCHAR(100) NOT NULL,
    user VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip VARCHAR(45) NOT NULL,
    level VARCHAR(20) NOT NULL
);

-- Categories table - Must be created BEFORE events table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    image_url VARCHAR(255) DEFAULT '/placeholder.svg',
    has_webinar BOOLEAN DEFAULT FALSE,
    webinar_link VARCHAR(255) NULL,
    webinar_time DATETIME NULL,
    created_by VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    booking_date DATETIME NOT NULL,
    tickets INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    webinar_access BOOLEAN DEFAULT FALSE,
    attendance_status ENUM('attended', 'partial', 'absent', 'unverified') DEFAULT 'unverified',
    certificate_enabled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    transaction_code VARCHAR(50) NULL,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Gmail settings table
CREATE TABLE IF NOT EXISTS gmail_settings (
    id INT PRIMARY KEY DEFAULT 1,
    enabled BOOLEAN DEFAULT TRUE,
    client_id VARCHAR(100) NOT NULL,
    redirect_uri VARCHAR(255) NOT NULL,
    scope VARCHAR(255) DEFAULT 'email profile',
    last_updated DATETIME NOT NULL,
    updated_by VARCHAR(100) NOT NULL
);

-- Payment logs table for M-Pesa transaction logging
CREATE TABLE IF NOT EXISTS payment_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_data TEXT NOT NULL,
    response_data TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    timestamp DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);

-- M-Pesa settings table
CREATE TABLE IF NOT EXISTS mpesa_settings (
    id INT PRIMARY KEY DEFAULT 1,
    consumer_key VARCHAR(100) NOT NULL,
    consumer_secret VARCHAR(100) NOT NULL,
    passkey VARCHAR(100) NOT NULL,
    shortcode VARCHAR(20) NOT NULL,
    environment VARCHAR(20) DEFAULT 'sandbox',
    callback_url VARCHAR(255) DEFAULT 'https://example.com/callback',
    last_updated DATETIME NOT NULL,
    updated_by VARCHAR(100) NOT NULL
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(50) PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    issued_date DATETIME NOT NULL,
    issued_by VARCHAR(100) NOT NULL,
    sent_email BOOLEAN DEFAULT FALSE,
    downloaded BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add indexes for common queries and performance
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_is_free ON events(is_free);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activity_logs(user);
CREATE INDEX IF NOT EXISTS idx_activities_level ON activity_logs(level);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activity_logs(timestamp);

-- Insert default categories - MUST happen BEFORE events data
INSERT INTO categories (id, name, description)
VALUES 
(1, 'Workshop', 'Technical hands-on workshops and training sessions'),
(2, 'Seminar', 'Educational seminars and presentations'),
(3, 'Conference', 'Industry conferences and multi-day events'),
(4, 'Exhibition', 'Science and technology exhibitions'),
(5, 'Hackathon', 'Coding and technology competitions')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

-- Insert default admin user
INSERT INTO users (id, name, email, phone, password, role) 
VALUES (1, 'Admin User', 'admin@maabara.co.ke', '0700000000', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE id = id;

-- Insert Gmail settings
INSERT INTO gmail_settings (id, enabled, client_id, redirect_uri, scope, last_updated, updated_by)
VALUES 
(1, TRUE, 'mock-client-id', 'https://example.com/auth/callback', 'email profile', NOW(), 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;

-- Insert M-Pesa settings (sandbox test credentials)
INSERT INTO mpesa_settings (id, consumer_key, consumer_secret, passkey, shortcode, environment, callback_url, last_updated, updated_by)
VALUES 
(1, '2sh7EgkM79EYKcAYsGZ9OAZlxgzXvDrG', 'F7jG9MnI3FppN8lY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', '174379', 'sandbox', 'https://example.com/callback', NOW(), 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;
