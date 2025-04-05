
/**
 * Database connection utility
 * This file handles communication with the PHP backend
 */

// Base URL for API endpoints - empty for relative path in production
const API_BASE_URL = '';

// Test database connection
export const testConnection = async () => {
  try {
    console.log('Testing database connection to:', `${API_BASE_URL}/api/test-connection.php`);
    const response = await fetch(`${API_BASE_URL}/api/test-connection.php`);
    
    if (!response.ok) {
      console.error('API health check failed');
      return false;
    }
    
    const data = await response.json();
    console.log('Connection test result:', data);
    return data.connected === true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Execute query via PHP backend
export const query = async (sql: string, params?: any[]) => {
  try {
    console.log('Sending query to API:', `${API_BASE_URL}/api/query.php`);
    
    // Send request to PHP endpoint
    const response = await fetch(`${API_BASE_URL}/api/query.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params: params || []
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown database error' }));
      throw new Error(errorData.message || 'Database query failed');
    }
    
    const data = await response.json();
    console.log('Query response:', data);
    
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
