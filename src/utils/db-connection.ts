
/**
 * Database connection utility
 * This file handles communication with the PHP backend
 */

// Base URL for PHP backend - changed to relative path for universal deployment
const API_BASE_URL = '/api';

// Test database connection
export const testConnection = async () => {
  try {
    console.log('Testing database connection to:', `${API_BASE_URL}/test-connection.php`);
    const response = await fetch(`${API_BASE_URL}/test-connection.php`);
    
    // Check if response is JSON 
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('PHP execution issue: Server returned PHP code instead of executing it');
      const text = await response.text();
      return false;
    }
    
    const data = await response.json();
    console.log('Connection test result:', data);
    return data.connected;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Test connection to online MySQL database
export const testOnlineConnection = async () => {
  try {
    console.log('Testing online MySQL database connection to:', `${API_BASE_URL}/test-db-connection.php`);
    const response = await fetch(`${API_BASE_URL}/test-db-connection.php`);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('PHP execution issue: Server returned PHP code instead of executing it');
      const text = await response.text();
      console.error('Response:', text);
      // Return the raw PHP response to help with debugging
      return text;
    }
    
    const data = await response.json();
    console.log('Online MySQL connection test result:', data);
    return data;
  } catch (error) {
    console.error('Online MySQL database connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : String(error),
      response: error instanceof Error && 'response' in error ? (error as any).response : null
    };
  }
};

// Execute query via PHP backend
export const query = async (sql: string, params?: any[]) => {
  try {
    console.log('Sending query to API:', `${API_BASE_URL}/query.php`);
    console.log('SQL:', sql);
    console.log('Params:', params || []);
    
    // Send request to PHP endpoint
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
    
    // Check if response is actually JSON (PHP is executing properly)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('PHP execution issue detected - response:', text);
      throw new Error('PHP execution failed - check server configuration');
    }
    
    const data = await response.json();
    console.log('Query response:', data);
    
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
  testConnection,
  testOnlineConnection
};
