// This file contains utilities to interact with MySQL database
import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

// Database configuration - Replace with your actual MySQL credentials
const dbConfig: DatabaseConfig = {
  host: "localhost",
  user: "maabara_user",
  password: "secure_password",
  database: "maabara_db"
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Fetch events from database
export const fetchEvents = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    return rows;
  } catch (error) {
    console.error('Error fetching events:', error);
    return mockEvents; // Fallback to mock data if query fails
  }
};

// Fetch categories from database
export const fetchCategories = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories; // Fallback to mock data if query fails
  }
};

// Fetch bookings from database
export const fetchBookings = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, e.title as event 
      FROM bookings b
      JOIN events e ON b.event_id = e.id
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return mockBookings; // Fallback to mock data if query fails
  }
};

// Fetch payments from database
export const fetchPayments = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, b.customer, e.title as event
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return mockPayments; // Fallback to mock data if query fails
  }
};

// Fetch activity logs from database
export const fetchActivityLogs = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC');
    return rows;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return mockLogs; // Fallback to mock data if query fails
  }
};

// Create a new event
export const createEvent = async (eventData: any) => {
  try {
    const { title, description, date, time, location, price, category, image } = eventData;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, time, location, price, category_id, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, price, category, image]
    );
    const insertId = (result as any).insertId;
    
    // Log the activity
    await logActivity({
      action: 'Event Created',
      user: 'admin@maabara.co.ke', // In a real app, this would be the logged-in user
      details: `Created new event: ${title}`,
      level: 'info'
    });
    
    return { success: true, id: insertId };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error };
  }
};

// Create a new category
export const createCategory = async (categoryData: any) => {
  try {
    const { name, description } = categoryData;
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    const insertId = (result as any).insertId;
    
    // Log the activity
    await logActivity({
      action: 'Category Created',
      user: 'admin@maabara.co.ke', // In a real app, this would be the logged-in user
      details: `Created new category: ${name}`,
      level: 'info'
    });
    
    return { success: true, id: insertId };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error };
  }
};

// Log activity
export const logActivity = async (activity: any) => {
  try {
    const { action, user, details, level } = activity;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const ip = "127.0.0.1"; // In a real app, this would be the actual IP
    
    await pool.query(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, action, user, details, ip, level]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error };
  }
};

// User authentication for login
export const authenticateUser = async (email: string, password: string) => {
  try {
    // In a real application, you would use bcrypt for password hashing and verification
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?', 
      [email, password]
    );
    
    const users = rows as any[];
    if (users.length === 0) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    const user = users[0];
    
    // Log the login activity
    await logActivity({
      action: 'User Login',
      user: email,
      details: 'User logged in successfully',
      level: 'info'
    });
    
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error };
  }
};

// Create a new user (registration)
export const createUser = async (userData: any) => {
  try {
    const { name, email, password, userType, organizationType } = userData;
    
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((existingUsers as any[]).length > 0) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // In a real application, you would hash the password with bcrypt
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, organization_type) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, userType, organizationType || null]
    );
    
    const insertId = (result as any).insertId;
    
    // Log the registration activity
    await logActivity({
      action: 'User Registration',
      user: email,
      details: `New ${userType} account created`,
      level: 'info'
    });
    
    return { success: true, id: insertId };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
};

// Mock data for development (fallback if database queries fail)
const mockEvents = [
  {
    id: 1,
    title: "Science Exhibition",
    date: "2023-08-15",
    location: "Main Hall",
    category: "Science",
    price: "500"
  },
  {
    id: 2,
    title: "Tech Workshop",
    date: "2023-08-20",
    location: "Lab 2",
    category: "Technology",
    price: "750"
  }
];

const mockCategories = [
  {
    id: 1,
    name: "Science",
    description: "Scientific exhibitions and events",
    events: 8
  },
  {
    id: 2,
    name: "Technology",
    description: "Technology workshops and seminars",
    events: 12
  }
];

const mockBookings = [
  {
    id: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    email: "john@example.com",
    phone: "0712345678",
    date: "2023-08-15",
    tickets: 2,
    total: "1000",
    status: "confirmed"
  },
  {
    id: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "0723456789",
    date: "2023-08-20",
    tickets: 1,
    total: "750",
    status: "confirmed"
  }
];

const mockPayments = [
  {
    id: "MPE123456",
    booking: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    phone: "0712345678",
    amount: "1000",
    date: "2023-08-15 14:22:30",
    method: "M-Pesa",
    status: "successful"
  },
  {
    id: "MPE234567",
    booking: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    phone: "0723456789",
    amount: "750",
    date: "2023-08-20 10:15:45",
    method: "M-Pesa",
    status: "successful"
  }
];

const mockLogs = [
  {
    id: 1,
    timestamp: "2023-08-25 09:30:45",
    action: "Event Created",
    user: "admin@maabara.co.ke",
    details: "Created new event: Science Exhibition",
    ip: "192.168.1.1",
    level: "info"
  },
  {
    id: 2,
    timestamp: "2023-08-25 10:15:22",
    action: "Payment Completed",
    user: "john@example.com",
    details: "Payment for Science Exhibition successful",
    ip: "192.168.1.15",
    level: "info"
  }
];
