
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
    const response = await fetch(`${API_BASE_URL}/api/test-connection.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('API health check failed with status:', response.status);
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
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        sql,
        params: params || []
      }),
    });
    
    if (!response.ok) {
      console.error('Query response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'Database query failed');
      } catch (parseError) {
        throw new Error(`Database query failed: ${errorText || response.statusText}`);
      }
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Unexpected content type:', contentType);
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Unexpected response format from server');
    }
    
    const data = await response.json();
    console.log('Query response:', data);
    
    if (data.error) {
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
