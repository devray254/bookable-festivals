
/**
 * Database connection utility
 * This file handles communication with the PHP backend
 */

// Base URL for PHP backend - updated to use absolute path
const API_BASE_URL = '/api';

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
    console.log('Sending query to API:', `${API_BASE_URL}/query.php`);
    
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
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response received:', await response.text());
      throw new Error('Server returned non-JSON response');
    }
    
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
