
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maabara_events',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'ok', connected: true });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', connected: false, message: 'Database connection failed' });
  }
});

// GET logs
app.get('/api/logs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// POST log
app.post('/api/logs', async (req, res) => {
  try {
    const { action, user, details, ip, level } = req.body;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const [result] = await pool.execute(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, action, user, details, ip || req.ip || '127.0.0.1', level || 'info']
    );
    
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ success: false, message: 'Failed to log activity' });
  }
});

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, organization_type FROM users ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST create user (admin)
app.post('/api/users/admin', async (req, res) => {
  try {
    const { name, email, phone, password, createdBy } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    
    // Insert new admin user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, password, 'admin']
    );
    
    // Log activity
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, 'Admin User Creation', createdBy, `New admin user ${email} created by ${createdBy}`, req.ip || '127.0.0.1', 'important']
    );
    
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ success: false, message: 'Failed to create admin user' });
  }
});

// POST password reset
app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { email, adminEmail } = req.body;
    
    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 24); // 24 hour expiry
    
    // Update user with reset token
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [resetToken, resetTokenExpires, email]
    );
    
    // Log activity
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, 'Password Reset Initiated', adminEmail, `Password reset initiated for ${email} by ${adminEmail}`, req.ip || '127.0.0.1', 'important']
    );
    
    // In a real app, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      success: true, 
      message: `Password reset link would be sent to ${email} in a real application.` 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate password reset' });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone, password, adminEmail } = req.body;
    
    const updateFields = [];
    const updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    
    if (password) {
      updateFields.push('password = ?');
      updateValues.push(password);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    updateValues.push(userId);
    
    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Log activity
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, 'User Update', adminEmail, `User ID ${userId} updated by ${adminEmail}`, req.ip || '127.0.0.1', 'info']
    );
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// Create database and tables if they don't exist
async function initializeDatabase() {
  try {
    // Create connection without database selection
    const initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    // Create database if it doesn't exist
    await initialConnection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'maabara_events'}`);
    await initialConnection.end();
    
    // Create tables
    const connection = await pool.getConnection();
    
    // Create activity_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp DATETIME NOT NULL,
        action VARCHAR(100) NOT NULL,
        user VARCHAR(100) NOT NULL,
        details TEXT,
        ip VARCHAR(45),
        level VARCHAR(20) DEFAULT 'info'
      )
    `);
    
    // Create users table with phone field and reset tokens
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        organization_type VARCHAR(50),
        reset_token VARCHAR(100) NULL,
        reset_token_expires DATETIME NULL
      )
    `);
    
    // Insert default admin user if none exists
    const [users] = await connection.execute('SELECT * FROM users WHERE role = "admin" LIMIT 1');
    if (users.length === 0) {
      await connection.execute(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin@maabara.co.ke', '0700000000', 'admin123', 'admin']
      );
      console.log('Default admin user created');
    }
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});
