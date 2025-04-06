
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

-- Insert default categories - MUST happen BEFORE events table
INSERT INTO categories (id, name, description) VALUES 
(1, 'Workshop', 'Technical hands-on workshops and training sessions'),
(2, 'Seminar', 'Educational seminars and presentations'),
(3, 'Conference', 'Industry conferences and multi-day events'),
(4, 'Exhibition', 'Science and technology exhibitions'),
(5, 'Hackathon', 'Coding and technology competitions')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

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

-- Gmail settings table
CREATE TABLE IF NOT EXISTS gmail_settings (
    id INT PRIMARY KEY DEFAULT 1,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    access_token VARCHAR(255),
    token_expiry DATETIME,
    sender_email VARCHAR(100) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    is_configured BOOLEAN DEFAULT FALSE,
    last_updated DATETIME,
    updated_by VARCHAR(100)
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_price ON events(price);
CREATE INDEX IF NOT EXISTS idx_events_is_free ON events(is_free);

-- Insert default admin user
INSERT INTO users (id, name, email, phone, password, role) 
VALUES (1, 'Admin User', 'admin@maabara.co.ke', '0700000000', '$2y$10$XFE/DtUhpLz1g5dDC9RkrOhbTCh3BSY9MF0RCS9PcZ6tI.5hLM7Qi', 'admin')
ON DUPLICATE KEY UPDATE id = id;
-- Password: admin123 (hashed with bcrypt)

-- Insert mock users with properly hashed passwords
INSERT INTO users (id, name, email, phone, password, role, organization_type) 
VALUES 
(2, 'John Doe', 'john@example.com', '0712345678', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'Hospital'),
(3, 'Jane Smith', 'jane@example.com', '0723456789', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'Clinic'),
(4, 'Michael Johnson', 'michael@example.com', '0734567890', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'University'),
(5, 'Sarah Williams', 'sarah@example.com', '0745678901', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'Medical School'),
(6, 'David Brown', 'david@example.com', '0756789012', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'Hospital'),
(7, 'Emily Davis', 'emily@example.com', '0767890123', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'Private Practice'),
(8, 'Alice Johnson', 'alice@example.com', '0798765432', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'attendee', 'Clinic'),
(9, 'Bob Martin', 'bob@example.com', '0709876543', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'organizer', 'University'),
(10, 'Carol White', 'carol@example.com', '0721987654', '$2y$10$x5nCuV.q3Z4XvbzE9YmEruNR4mFcxHMHyXjZgWcRRbHfC4xmS7P9W', 'organizer', 'Hospital')
ON DUPLICATE KEY UPDATE id = id;
-- Password: password123 (hashed with bcrypt for all users)

-- Insert mock events (enhanced with more descriptive content)
INSERT INTO events (id, title, date, time, location, price, is_free, description, category_id, image_url, has_webinar, webinar_link, created_by)
VALUES 
(1, 'Science Exhibition', '2025-09-15', '09:00:00', 'Nairobi Science Center', 750.00, 0, 'A comprehensive exhibition showcasing scientific innovations from across the country. This exhibition will feature the latest advances in medical technology, healthcare solutions, and scientific research relevant to healthcare professionals. Attendees will have the opportunity to interact with exhibitors, attend demonstration sessions, and network with peers in the healthcare industry.', 4, '/placeholder.svg', 1, 'https://zoom.us/j/123456789', 'admin@maabara.co.ke'),
(2, 'Healthcare Tech Workshop', '2025-10-20', '10:00:00', 'Kenyatta University', 500.00, 0, 'Hands-on workshop on the latest healthcare technologies. This intensive workshop will cover electronic health records systems, telemedicine platforms, medical imaging technologies, and healthcare data analytics. Participants will gain practical skills through guided exercises and real-world case studies. Certificate of completion will be provided to all attendees.', 1, '/placeholder.svg', 1, 'https://zoom.us/j/987654321', 'admin@maabara.co.ke'),
(3, 'Advanced Chemistry Seminar', '2025-11-05', '14:00:00', 'University of Nairobi', 300.00, 0, 'Seminar on recent advancements in pharmaceutical chemistry and drug development. This seminar will feature presentations from leading researchers and industry professionals on topics including drug discovery pipelines, computational chemistry, biologics development, and regulatory considerations. Question and answer sessions will provide opportunities for in-depth discussions on current challenges and innovations.', 2, '/placeholder.svg', 0, NULL, 'admin@maabara.co.ke'),
(4, 'Health Data Science Bootcamp', '2025-12-10', '09:00:00', 'iHub, Nairobi', 1000.00, 0, 'Intensive bootcamp on healthcare data science fundamentals. This three-day bootcamp will cover statistical analysis of healthcare data, machine learning applications in diagnostics, predictive modeling for patient outcomes, and ethical considerations in health data science. Participants should have basic knowledge of statistics and programming. Laptops are required for practical sessions.', 1, '/placeholder.svg', 1, 'https://zoom.us/j/112233445', 'admin@maabara.co.ke'),
(5, 'Medical Physics Symposium', '2026-01-15', '13:00:00', 'JKUAT, Juja', 450.00, 0, 'Annual medical physics symposium with guest speakers from renowned universities. This symposium will focus on radiation therapy advancements, medical imaging technology innovations, radiation protection standards, and quality assurance in medical physics. The event will feature keynote addresses, panel discussions, research presentations, and networking opportunities. CPD points will be awarded to all attendees.', 4, '/placeholder.svg', 0, NULL, 'admin@maabara.co.ke'),
(6, 'Women in Healthcare Leadership', '2026-02-25', '10:00:00', 'Strathmore University', 0.00, 1, 'A free workshop focused on empowering women in healthcare leadership positions. This workshop will address challenges and opportunities for women in healthcare leadership, featuring successful female leaders who will share their experiences and insights. Topics include career advancement strategies, work-life balance, mentorship opportunities, and building professional networks. Registration is required despite the event being free of charge.', 1, '/placeholder.svg', 1, 'https://zoom.us/j/998877665', 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;

-- Insert bookings
INSERT INTO bookings (id, event_id, user_id, customer_name, customer_email, customer_phone, booking_date, tickets, total_amount, status, webinar_access, attendance_status, certificate_enabled)
VALUES 
(101, 1, 2, 'John Doe', 'john@example.com', '0712345678', '2025-07-15 10:24:36', 1, 750.00, 'confirmed', 1, 'attended', 1),
(102, 1, 3, 'Jane Smith', 'jane@example.com', '0723456789', '2025-07-17 14:15:22', 1, 750.00, 'confirmed', 1, 'attended', 1),
(103, 1, 4, 'Michael Johnson', 'michael@example.com', '0734567890', '2025-07-18 09:45:12', 1, 750.00, 'confirmed', 1, 'partial', 0),
(104, 2, 5, 'Sarah Williams', 'sarah@example.com', '0745678901', '2025-08-05 16:30:45', 2, 1000.00, 'confirmed', 1, 'attended', 1),
(105, 2, 6, 'David Brown', 'david@example.com', '0756789012', '2025-08-10 11:20:18', 1, 500.00, 'confirmed', 1, 'attended', 1),
(106, 3, 7, 'Emily Davis', 'emily@example.com', '0767890123', '2025-09-01 08:15:30', 1, 300.00, 'confirmed', 0, 'unverified', 0),
(107, 4, 8, 'Alice Johnson', 'alice@example.com', '0798765432', '2025-09-15 13:45:22', 1, 1000.00, 'pending', 0, 'unverified', 0),
(108, 6, 2, 'John Doe', 'john@example.com', '0712345678', '2025-09-20 09:10:15', 1, 0.00, 'confirmed', 1, 'unverified', 0)
ON DUPLICATE KEY UPDATE id = id;

-- Insert payments
INSERT INTO payments (id, booking_id, user_id, event_id, amount, payment_date, method, status, transaction_code)
VALUES 
('PAY001', 101, 2, 1, 750.00, '2025-07-15 10:30:00', 'M-Pesa', 'completed', 'MPE123456789'),
('PAY002', 102, 3, 1, 750.00, '2025-07-17 14:20:00', 'M-Pesa', 'completed', 'MPE987654321'),
('PAY003', 103, 4, 1, 750.00, '2025-07-18 09:50:00', 'M-Pesa', 'completed', 'MPE456789123'),
('PAY004', 104, 5, 2, 1000.00, '2025-08-05 16:35:00', 'M-Pesa', 'completed', 'MPE789123456'),
('PAY005', 105, 6, 2, 500.00, '2025-08-10 11:25:00', 'Cash', 'completed', 'CASH001'),
('PAY006', 106, 7, 3, 300.00, '2025-09-01 08:20:00', 'M-Pesa', 'completed', 'MPE321654987'),
('PAY007', 107, 8, 4, 1000.00, '2025-09-15 13:50:00', 'M-Pesa', 'pending', 'MPE456789012');
-- Note: No payment for booking 108 as it's a free event

-- Insert activity logs
INSERT INTO activity_logs (id, timestamp, action, user, details, ip, level)
VALUES 
(1, '2025-07-15 10:35:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #101', '127.0.0.1', 'info'),
(2, '2025-07-17 14:25:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #102', '127.0.0.1', 'info'),
(3, '2025-07-18 09:55:00', 'Payment Received', 'system', 'Payment of KES 750.00 received for booking #103', '127.0.0.1', 'info'),
(4, '2025-08-05 16:40:00', 'Payment Received', 'system', 'Payment of KES 1000.00 received for booking #104', '127.0.0.1', 'info'),
(5, '2025-08-10 11:30:00', 'Payment Received', 'system', 'Payment of KES 500.00 received for booking #105', '127.0.0.1', 'info'),
(6, '2025-09-01 08:25:00', 'Payment Received', 'system', 'Payment of KES 300.00 received for booking #106', '127.0.0.1', 'info'),
(7, '2025-09-10 15:30:00', 'User Login', 'admin@maabara.co.ke', 'Admin user logged in', '127.0.0.1', 'info'),
(8, '2025-09-10 15:45:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Science Exhibition', '127.0.0.1', 'important'),
(9, '2025-09-10 16:00:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Healthcare Tech Workshop', '127.0.0.1', 'important'),
(10, '2025-09-10 16:15:00', 'Event Created', 'admin@maabara.co.ke', 'Created new event: Advanced Chemistry Seminar', '127.0.0.1', 'important'),
(11, '2025-09-15 13:55:00', 'Payment Status', 'system', 'Payment for booking #107 is pending confirmation', '127.0.0.1', 'warning'),
(12, '2025-09-20 09:15:00', 'Free Registration', 'system', 'User registered for free event: Women in Healthcare Leadership', '127.0.0.1', 'info'),
(13, '2025-09-25 14:20:00', 'Certificate Generated', 'admin@maabara.co.ke', 'Certificate issued for user John Doe for event #1', '127.0.0.1', 'info'),
(14, '2025-09-25 14:25:00', 'Certificate Generated', 'admin@maabara.co.ke', 'Certificate issued for user Jane Smith for event #1', '127.0.0.1', 'info'),
(15, '2025-09-30 10:15:00', 'Certificate Generated', 'admin@maabara.co.ke', 'Certificate issued for user Sarah Williams for event #2', '127.0.0.1', 'info'),
(16, '2025-09-30 10:20:00', 'Certificate Generated', 'admin@maabara.co.ke', 'Certificate issued for user David Brown for event #2', '127.0.0.1', 'info');

-- Insert certificates
INSERT INTO certificates (id, event_id, user_id, issued_date, issued_by, sent_email, downloaded)
VALUES 
('CERT-1-2-1726569600000', 1, 2, '2025-09-25 14:20:00', 'admin@maabara.co.ke', 1, 1),
('CERT-1-3-1726569900000', 1, 3, '2025-09-25 14:25:00', 'admin@maabara.co.ke', 1, 0),
('CERT-2-5-1727003700000', 2, 5, '2025-09-30 10:15:00', 'admin@maabara.co.ke', 1, 1),
('CERT-2-6-1727004000000', 2, 6, '2025-09-30 10:20:00', 'admin@maabara.co.ke', 1, 0);

-- Insert M-Pesa settings (sandbox test credentials)
INSERT INTO mpesa_settings (id, consumer_key, consumer_secret, passkey, shortcode, environment, callback_url, last_updated, updated_by)
VALUES 
(1, '2sh7EgkM79EYKcAYsGZ9OAZlxgzXvDrG', 'F7jG9MnI3FppN8lY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', '174379', 'sandbox', 'https://example.com/callback', NOW(), 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;

-- Insert Gmail settings (placeholder test values)
INSERT INTO gmail_settings (id, client_id, client_secret, sender_email, sender_name, is_configured, last_updated, updated_by)
VALUES 
(1, 'your-client-id.apps.googleusercontent.com', 'your-client-secret', 'noreply@maabara.co.ke', 'Maabara Events', 0, NOW(), 'admin@maabara.co.ke')
ON DUPLICATE KEY UPDATE id = id;

