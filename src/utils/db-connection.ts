
/**
 * IMPORTANT: This file is set up for development purposes with mock data.
 * In a production environment, database connections should be handled by a backend API.
 * The browser cannot directly connect to MySQL as it's a Node.js capability.
 */

// Mock database functionality for browser environment
console.log('Using mock database service for browser environment');

// Test database connection - always returns false in browser
export const testConnection = async () => {
  console.log('Testing mock database connection');
  return false; // In browser, we can't connect directly to MySQL
};

// Execute query with mock data
export const query = async (sql: string, params?: any[]) => {
  console.log('Executing mock query:', sql, 'with params:', params);
  return getMockResponse(sql, params);
};

// Mock response generator for browser environment
const getMockResponse = (sql: string, params?: any[]) => {
  if (sql.toLowerCase().includes('select * from activity_logs')) {
    return getMockLogs();
  } else if (sql.toLowerCase().includes('insert into activity_logs')) {
    console.log('Mock log activity inserted');
    return { insertId: Math.floor(Math.random() * 1000) };
  } else if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('from users')) {
    return getMockUsers(params);
  } else if (sql.toLowerCase().includes('insert into users')) {
    console.log('Mock user created');
    return { insertId: Math.floor(Math.random() * 1000) };
  }
  
  // Default mock response for SELECT queries
  if (sql.toLowerCase().includes('select')) {
    return [];
  }
  
  // Default response for non-SELECT queries
  return { affectedRows: 0 };
};

// Mock logs data
const getMockLogs = () => {
  return [
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
    },
    {
      id: 3,
      timestamp: "2023-08-25 11:05:33",
      action: "Booking Created",
      user: "jane@example.com",
      details: "New booking for Tech Workshop",
      ip: "192.168.1.22",
      level: "info"
    },
    {
      id: 4,
      timestamp: "2023-08-25 12:45:10",
      action: "Payment Failed",
      user: "mike@example.com",
      details: "Payment for Chemistry Seminar failed: Invalid card details",
      ip: "192.168.1.30",
      level: "error"
    },
    {
      id: 5,
      timestamp: "2023-08-25 13:20:18",
      action: "User Login",
      user: "admin@maabara.co.ke",
      details: "Admin login successful",
      ip: "192.168.1.1",
      level: "info"
    }
  ];
};

// Mock users data
const getMockUsers = (params?: any[]) => {
  const users = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@maabara.co.ke',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'attendee'
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'jane123',
      role: 'attendee'
    },
    {
      id: 4,
      name: 'Event Manager',
      email: 'manager@maabara.co.ke',
      password: 'manager123',
      role: 'organizer'
    }
  ];
  
  // If params are provided for a login query, filter by email and password
  if (params && params.length >= 2) {
    const email = params[0];
    const password = params[1];
    return users.filter(user => user.email === email && user.password === password);
  }
  
  return users;
};

export default {
  query,
  testConnection
};
