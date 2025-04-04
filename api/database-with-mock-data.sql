
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
    reset_token_expires DATETIME NULL
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

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    has_webinar BOOLEAN DEFAULT FALSE,
    webinar_link VARCHAR(255) NULL,
    webinar_time DATETIME NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    events INT DEFAULT 0
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    customer VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    tickets INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    webinar_access BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
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
    id VARCHAR(100) PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    issued_date DATETIME NOT NULL,
    issued_by VARCHAR(100) NOT NULL,
    sent_email BOOLEAN DEFAULT FALSE,
    downloaded BOOLEAN DEFAULT FALSE,
    UNIQUE KEY event_user_unique (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default admin user
INSERT INTO users (id, name, email, phone, password, role) 
VALUES (1, 'Admin User', 'admin@maabara.co.ke', '0700000000', 'admin123', 'admin');

-- Insert mock users
INSERT INTO users (id, name, email, phone, password, role) 
VALUES 
(2, 'John Doe', 'john@example.com', '0712345678', 'password123', 'attendee'),
(3, 'Jane Smith', 'jane@example.com', '0723456789', 'password123', 'attendee'),
(4, 'Michael Johnson', 'michael@example.com', '0734567890', 'password123', 'attendee'),
(5, 'Sarah Williams', 'sarah@example.com', '0745678901', 'password123', 'attendee'),
(6, 'David Brown', 'david@example.com', '0756789012', 'password123', 'attendee'),
(7, 'Emily Davis', 'emily@example.com', '0767890123', 'password123', 'attendee'),
(8, 'Alice Johnson', 'alice@example.com', '0798765432', 'password123', 'attendee'),
(9, 'Bob Martin', 'bob@example.com', '0709876543', 'password123', 'organizer'),
(10, 'Carol White', 'carol@example.com', '0721987654', 'password123', 'organizer');

-- Insert categories
INSERT INTO categories (id, name, description, events)
VALUES 
(1, 'Science', 'Scientific events and exhibitions', 2),
(2, 'Technology', 'Tech-related workshops and conferences', 2),
(3, 'Chemistry', 'Chemistry and related science events', 1),
(4, 'Mathematics', 'Mathematics competitions and workshops', 0),
(5, 'Biology', 'Biological science events and workshops', 0);

-- Insert events
INSERT INTO events (id, title, date, location, category, price, description, has_webinar, webinar_link, webinar_time)
VALUES 
(1, 'Science Exhibition', '2023-09-15', 'Nairobi Science Center', 'Science', 750.00, 'A comprehensive exhibition showcasing scientific innovations from across the country. Participants will have the opportunity to interact with scientists and learn about cutting-edge research.', true, 'https://zoom.us/j/scienceexpo', '2023-09-15 14:00:00'),
(2, 'Tech Workshop', '2023-10-20', 'Kenyatta University', 'Technology', 500.00, 'Hands-on workshop on the latest technologies. Learn about AI, machine learning, and blockchain in this interactive session.', true, 'https://zoom.us/j/techworkshop', '2023-10-20 10:00:00'),
(3, 'Chemistry Seminar', '2023-11-05', 'University of Nairobi', 'Chemistry', 300.00, 'Seminar on recent advancements in chemical sciences. Leading professors will share insights from their research.', false, NULL, NULL),
(4, 'Data Science Bootcamp', '2023-12-10', 'iHub, Nairobi', 'Technology', 1000.00, 'Intensive bootcamp on data science fundamentals. Learn data analysis, visualization, and machine learning techniques.', true, 'https://zoom.us/j/datasciencebootcamp', '2023-12-10 09:00:00'),
(5, 'Physics Symposium', '2024-01-15', 'JKUAT, Juja', 'Science', 450.00, 'Annual physics symposium with guest speakers from renowned universities. Topics include quantum physics and astrophysics.', false, NULL, NULL);

-- Insert bookings
INSERT INTO bookings (id, event_id, user_id, customer, email, phone, date, tickets, total, status, webinar_access)
VALUES 
(101, 1, 2, 'John Doe', 'john@example.com', '0712345678', '2023-07-15', 1, 750.00, 'confirmed', true),
(102, 1, 3, 'Jane Smith', 'jane@example.com', '0723456789', '2023-07-17', 1, 750.00, 'confirmed', true),
(103, 1, 4, 'Michael Johnson', 'michael@example.com', '0734567890', '2023-07-18', 1, 750.00, 'confirmed', true),
(104, 2, 5, 'Sarah Williams', 'sarah@example.com', '0745678901', '2023-08-05', 1, 500.00, 'confirmed', true),
(105, 2, 6, 'David Brown', 'david@example.com', '0756789012', '2023-08-10', 1, 500.00, 'confirmed', true),
(106, 3, 7, 'Emily Davis', 'emily@example.com', '0767890123', '2023-09-01', 1, 300.00, 'confirmed', false),
(107, 3, 8, 'Alice Johnson', 'alice@example.com', '0798765432', '2023-09-02', 1, 300.00, 'pending', false),
(108, 4, 2, 'John Doe', 'john@example.com', '0712345678', '2023-10-15', 1, 1000.00, 'pending', false),
(109, 5, 3, 'Jane Smith', 'jane@example.com', '0723456789', '2023-11-10', 1, 450.00, 'pending', false);

-- Insert payments
INSERT INTO payments (id, booking_id, user_id, event_id, amount, payment_method, transaction_id, status, created_at)
VALUES 
(1, 101, 2, 1, 750.00, 'M-Pesa', 'MPE123456789', 'completed', '2023-07-18 10:24:36'),
(2, 102, 3, 1, 750.00, 'M-Pesa', 'MPE987654321', 'completed', '2023-07-19 14:15:22'),
(3, 103, 4, 1, 750.00, 'M-Pesa', 'MPE456789123', 'completed', '2023-07-20 09:45:12'),
(4, 104, 5, 2, 500.00, 'M-Pesa', 'MPE789123456', 'completed', '2023-08-07 16:30:45'),
(5, 105, 6, 2, 500.00, 'Cash', 'CASH001', 'completed', '2023-08-12 11:20:18'),
(6, 106, 7, 3, 300.00, 'M-Pesa', 'MPE321654987', 'completed', '2023-09-03 08:15:30');

-- Insert M-Pesa settings (sandbox test credentials)
INSERT INTO mpesa_settings (id, consumer_key, consumer_secret, passkey, shortcode, environment, callback_url, last_updated, updated_by)
VALUES 
(1, '2sh7EgkM79EYKcAYsGZ9OAZlxgzXvDrG', 'F7jG9MnI3FppN8lY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', '174379', 'sandbox', 'https://example.com/callback', NOW(), 'admin@maabara.co.ke');

-- Insert activity logs
INSERT INTO activity_logs (id, timestamp, action, user, details, ip, level)
VALUES 
(1, '2023-07-18 10:25:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #101', '127.0.0.1', 'info'),
(2, '2023-07-19 14:16:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #102', '127.0.0.1', 'info'),
(3, '2023-07-20 09:46:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #103', '127.0.0.1', 'info'),
(4, '2023-08-07 16:31:00', 'Payment Received', 'system', 'Payment of KES 500.00 received for booking #104', '127.0.0.1', 'info'),
(5, '2023-08-12 11:21:00', 'Payment Received', 'system', 'Payment of KES 500.00 received for booking #105', '127.0.0.1', 'info'),
(6, '2023-09-03 08:16:00', 'Payment Received', 'system', 'Payment of KES 300.00 received for booking #106', '127.0.0.1', 'info'),
(7, '2023-09-10 15:30:00', 'User Login', 'admin@maabara.co.ke', 'Admin user logged in', '127.0.0.1', 'info'),
(8, '2023-09-10 15:45:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Science Exhibition', '127.0.0.1', 'important'),
(9, '2023-09-10 16:00:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Tech Workshop', '127.0.0.1', 'important'),
(10, '2023-09-10 16:15:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Chemistry Seminar', '127.0.0.1', 'important'),
(11, '2023-10-05 09:20:00', 'User Registered', 'system', 'New user registered: john@example.com', '192.168.1.1', 'info'),
(12, '2023-10-05 10:30:00', 'User Registered', 'system', 'New user registered: jane@example.com', '192.168.1.2', 'info'),
(13, '2023-10-05 11:45:00', 'User Registered', 'system', 'New user registered: michael@example.com', '192.168.1.3', 'info'),
(14, '2023-10-05 14:20:00', 'M-Pesa Settings Updated', 'admin@maabara.co.ke', 'Updated M-Pesa API configuration', '127.0.0.1', 'important'),
(15, '2023-10-10 16:30:00', 'Certificate Generated', 'admin@maabara.co.ke', 'Generated certificate for user ID 2 for event ID 1', '127.0.0.1', 'info');

-- Insert certificates
INSERT INTO certificates (id, event_id, user_id, issued_date, issued_by, sent_email, downloaded)
VALUES 
('CERT-1-2-1695302400000', 1, 2, '2023-09-21 15:00:00', 'admin@maabara.co.ke', true, true),
('CERT-1-3-1695302400001', 1, 3, '2023-09-21 15:05:00', 'admin@maabara.co.ke', true, false),
('CERT-1-4-1695302400002', 1, 4, '2023-09-21 15:10:00', 'admin@maabara.co.ke', false, false),
('CERT-2-5-1698739200000', 2, 5, '2023-10-31 14:00:00', 'admin@maabara.co.ke', true, true),
('CERT-2-6-1698739200001', 2, 6, '2023-10-31 14:05:00', 'admin@maabara.co.ke', true, false),
('CERT-3-7-1701331200000', 3, 7, '2023-11-30 16:00:00', 'admin@maabara.co.ke', false, false);
