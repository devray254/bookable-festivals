
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',  // Default empty password for local development
  database: 'maabara_events',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Execute queries with error handling
export const query = async (sql: string, params?: any[]) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

export default {
  query,
  testConnection
};
