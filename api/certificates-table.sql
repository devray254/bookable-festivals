
-- Create certificates table if it doesn't exist
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

-- Add index for common queries
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- Add column to bookings table for attendance tracking if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS attendance_status 
    ENUM('attended', 'partial', 'absent', 'unverified') 
    DEFAULT 'unverified';

-- Add column to bookings table for certificate download permission if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS certificate_enabled 
    BOOLEAN DEFAULT FALSE;
