
/**
 * Database connection utility
 * This file handles communication with the Node.js backend
 */

// Base URL for Node.js backend - changed to relative path for universal deployment
const API_BASE_URL = '';

// Test database connection
export const testConnection = async () => {
  try {
    console.log('Testing database connection to:', `${API_BASE_URL}/api/health`);
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      console.error('Node.js API health check failed');
      return false;
    }
    
    const data = await response.json();
    console.log('Connection test result:', data);
    return data.status === 'ok';
  } catch (error) {
    console.error('Node.js API connection test failed:', error);
    return false;
  }
};

// Test connection to online MySQL database
export const testOnlineConnection = async () => {
  try {
    console.log('Testing online MySQL database connection via Node.js API');
    const response = await fetch(`${API_BASE_URL}/api/test-db-connection`);
    
    if (!response.ok) {
      console.error('Node.js API database test failed with status:', response.status);
      const errorText = await response.text();
      console.error('Response:', errorText);
      
      try {
        // Try to parse as JSON even if the response wasn't ok
        return JSON.parse(errorText);
      } catch (parseError) {
        // Return text response if not JSON
        return { 
          success: false, 
          message: 'Failed to connect to database API',
          response: errorText
        };
      }
    }
    
    const data = await response.json();
    console.log('Online MySQL connection test result:', data);
    return data;
  } catch (error) {
    console.error('Online MySQL database connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : String(error),
      error: 'connection_failed'
    };
  }
};

// Execute query via Node.js backend
export const query = async (sql: string, params?: any[]) => {
  try {
    console.log('Sending query to API:', `${API_BASE_URL}/api/query`);
    console.log('SQL:', sql);
    console.log('Params:', params || []);
    
    // Send request to Node.js endpoint
    const response = await fetch(`${API_BASE_URL}/api/query`, {
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
  testConnection,
  testOnlineConnection
};
