
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

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);

-- Insert default categories - MUST happen BEFORE events table
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

-- Insert mock users
INSERT INTO users (id, name, email, phone, password, role) 
VALUES 
(2, 'John Doe', 'john@example.com', '0712345678', 'password123', 'attendee'),
(3, 'Jane Smith', 'jane@example.com', '0723456789', 'password123', 'attendee'),
(4, 'Michael Johnson', 'michael@example.com', '0734567890', 'password123', 'attendee'),
(5, 'Sarah Williams', 'sarah@example.com', '0745678901', 'password123', 'attendee'),
(6, 'David Brown', 'david@example.com', '0756789012', 'password123', 'attendee'),
(7, 'Emily Davis', 'emily@example.com', '0767890123', 'password123', 'attendee')
ON DUPLICATE KEY UPDATE id = id;

-- Insert mock events with both free and paid options
INSERT INTO events (id, title, date, time, location, price, is_free, description, category_id, image_url, has_webinar, created_by) 
VALUES 
(1, 'Science Exhibition', '2025-07-15', '09:00:00', 'Nairobi Science Center', 750.00, 0, 'A comprehensive exhibition showcasing scientific innovations from across the country.', 4, '/placeholder.svg', 1, 'admin@maabara.co.ke'),
(2, 'Tech Workshop', '2025-08-20', '10:00:00', 'Kenyatta University', 500.00, 0, 'Hands-on workshop on the latest technologies.', 1, '/placeholder.svg', 1, 'admin@maabara.co.ke'),
(3, 'Chemistry Seminar', '2025-09-05', '14:00:00', 'University of Nairobi', 300.00, 0, 'Seminar on recent advancements in chemical sciences.', 2, '/placeholder.svg', 0, 'admin@maabara.co.ke'),
(4, 'Data Science Bootcamp', '2025-10-10', '09:00:00', 'iHub, Nairobi', 1000.00, 0, 'Intensive bootcamp on data science fundamentals.', 1, '/placeholder.svg', 1, 'admin@maabara.co.ke'),
(5, 'Free Coding Workshop', '2025-11-15', '13:00:00', 'JKUAT, Juja', 0.00, 1, 'Free workshop on coding basics for beginners.', 1, '/placeholder.svg', 0, 'admin@maabara.co.ke'),
(6, 'Open Science Fair', '2025-12-01', '10:00:00', 'Sarit Center', 0.00, 1, 'Open science fair with demos and hands-on activities.', 4, '/placeholder.svg', 0, 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;

-- Insert mock bookings
INSERT INTO bookings (id, event_id, user_id, customer_name, customer_email, customer_phone, booking_date, tickets, total_amount, status, webinar_access, attendance_status) 
VALUES 
(1, 1, 2, 'John Doe', 'john@example.com', '0712345678', '2025-06-15 10:24:36', 1, 750.00, 'confirmed', 1, 'attended'),
(2, 1, 3, 'Jane Smith', 'jane@example.com', '0723456789', '2025-06-17 14:15:22', 1, 750.00, 'confirmed', 1, 'attended'),
(3, 1, 4, 'Michael Johnson', 'michael@example.com', '0734567890', '2025-06-18 09:45:12', 1, 750.00, 'confirmed', 1, 'partial'),
(4, 2, 5, 'Sarah Williams', 'sarah@example.com', '0745678901', '2025-07-05 16:30:45', 1, 500.00, 'confirmed', 1, 'unverified'),
(5, 2, 6, 'David Brown', 'david@example.com', '0756789012', '2025-07-10 11:20:18', 1, 500.00, 'confirmed', 1, 'unverified'),
(6, 3, 7, 'Emily Davis', 'emily@example.com', '0767890123', '2025-08-01 08:15:30', 1, 300.00, 'confirmed', 0, 'unverified'),
(7, 5, 2, 'John Doe', 'john@example.com', '0712345678', '2025-10-10 08:30:00', 1, 0.00, 'confirmed', 0, 'unverified'),
(8, 6, 3, 'Jane Smith', 'jane@example.com', '0723456789', '2025-11-15 09:45:00', 2, 0.00, 'confirmed', 0, 'unverified')
ON DUPLICATE KEY UPDATE id = id;

-- Insert mock payments (only for paid events)
INSERT INTO payments (id, booking_id, user_id, event_id, amount, payment_date, method, status, transaction_code) 
VALUES 
('PAY001', 1, 2, 1, 750.00, '2025-06-15 10:30:00', 'M-Pesa', 'completed', 'MPE123456789'),
('PAY002', 2, 3, 1, 750.00, '2025-06-17 14:20:00', 'M-Pesa', 'completed', 'MPE987654321'),
('PAY003', 3, 4, 1, 750.00, '2025-06-18 09:50:00', 'M-Pesa', 'completed', 'MPE456789123'),
('PAY004', 4, 5, 2, 500.00, '2025-07-05 16:35:00', 'M-Pesa', 'completed', 'MPE789123456'),
('PAY005', 5, 6, 2, 500.00, '2025-07-10 11:25:00', 'Cash', 'completed', 'CASH001'),
('PAY006', 6, 7, 3, 300.00, '2025-08-01 08:20:00', 'M-Pesa', 'completed', 'MPE321654987');

-- Insert mock certificates
INSERT INTO certificates (id, event_id, user_id, issued_date, issued_by, sent_email, downloaded) 
VALUES 
('CERT-1-2-1695302400000', 1, 2, '2025-09-21 15:00:00', 'admin@maabara.co.ke', 1, 1),
('CERT-1-3-1695302400001', 1, 3, '2025-09-21 15:05:00', 'admin@maabara.co.ke', 1, 0),
('CERT-1-4-1695302400002', 1, 4, '2025-09-21 15:10:00', 'admin@maabara.co.ke', 0, 0);

-- Insert M-Pesa settings (sandbox test credentials)
INSERT INTO mpesa_settings (id, consumer_key, consumer_secret, passkey, shortcode, environment, callback_url, last_updated, updated_by)
VALUES 
(1, '2sh7EgkM79EYKcAYsGZ9OAZlxgzXvDrG', 'F7jG9MnI3FppN8lY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', '174379', 'sandbox', 'https://example.com/callback', NOW(), 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;

-- Insert activity logs
INSERT INTO activity_logs (id, timestamp, action, user, details, ip, level)
VALUES 
(1, '2025-06-15 10:35:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #1', '127.0.0.1', 'info'),
(2, '2025-06-17 14:25:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #2', '127.0.0.1', 'info'),
(3, '2025-06-18 09:55:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #3', '127.0.0.1', 'info'),
(4, '2025-07-05 16:40:00', 'Payment Received', 'system', 'Payment of KES 500.00 received for booking #4', '127.0.0.1', 'info'),
(5, '2025-07-10 11:30:00', 'Payment Received', 'system', 'Payment of KES 500.00 received for booking #5', '127.0.0.1', 'info'),
(6, '2025-08-01 08:25:00', 'Payment Received', 'system', 'Payment of KES 300.00 received for booking #6', '127.0.0.1', 'info'),
(7, '2025-06-01 15:30:00', 'User Login', 'admin@maabara.co.ke', 'Admin user logged in', '127.0.0.1', 'info'),
(8, '2025-06-01 15:45:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Science Exhibition', '127.0.0.1', 'important'),
(9, '2025-06-01 16:00:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Tech Workshop', '127.0.0.1', 'important'),
(10, '2025-06-01 16:15:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Chemistry Seminar', '127.0.0.1', 'important');
