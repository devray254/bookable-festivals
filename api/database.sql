
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

-- Categories table
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
    id VARCHAR(36) PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    issued_date DATETIME NOT NULL,
    downloaded BOOLEAN DEFAULT FALSE,
    emailed BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default categories if none exist
INSERT INTO categories (name, description)
SELECT 'Workshop', 'Technical hands-on workshops and training sessions'
WHERE NOT EXISTS (SELECT 1 FROM categories LIMIT 1);

INSERT INTO categories (name, description)
SELECT 'Seminar', 'Educational seminars and presentations'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 2);

INSERT INTO categories (name, description)
SELECT 'Conference', 'Industry conferences and multi-day events'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 3);

INSERT INTO categories (name, description)
SELECT 'Exhibition', 'Showcases and demonstrations of products and services'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 4);

INSERT INTO categories (name, description)
SELECT 'Hackathon', 'Competitive coding and problem solving events'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 5);

-- Insert default admin user if not exists
INSERT IGNORE INTO users (id, name, email, phone, password, role) 
VALUES (1, 'Admin User', 'admin@maabara.co.ke', '0700000000', 'admin123', 'admin');

-- Insert sample events
INSERT INTO events (title, description, date, time, location, price, is_free, category_id, image_url, created_by)
SELECT 
    'Tech Workshop 2023', 
    'A comprehensive hands-on workshop on the latest technologies', 
    '2023-12-10', 
    '09:00:00', 
    'Maabara Labs, Nairobi', 
    1500, 
    0, 
    1, 
    '/placeholder.svg', 
    'admin@maabara.co.ke'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 1);

INSERT INTO events (title, description, date, time, location, price, is_free, category_id, image_url, created_by)
SELECT 
    'Free AI Seminar', 
    'Learn about the latest advancements in artificial intelligence', 
    '2023-11-15', 
    '14:00:00', 
    'Virtual Event', 
    0, 
    1, 
    2, 
    '/placeholder.svg', 
    'admin@maabara.co.ke'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 2);

INSERT INTO events (title, description, date, time, location, price, is_free, category_id, image_url, created_by)
SELECT 
    'Annual Tech Conference', 
    'The largest technology conference in East Africa', 
    '2023-12-01', 
    '08:00:00', 
    'KICC, Nairobi', 
    3000, 
    0, 
    3, 
    '/placeholder.svg', 
    'admin@maabara.co.ke'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE id = 3);
