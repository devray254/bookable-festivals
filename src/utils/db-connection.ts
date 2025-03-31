
/**
 * Database connection utility
 * This file handles communication with the PHP backend
 */

// Base URL for PHP backend
const API_BASE_URL = './api';

// Test database connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-connection.php`);
    const data = await response.json();
    return data.connected;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Execute query via PHP backend
export const query = async (sql: string, params?: any[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/query.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params: params || []
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Database query failed');
    }
    
    return data.result;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
};

export default {
  query,
  testConnection
};
