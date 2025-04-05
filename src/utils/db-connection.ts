
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
    
    // For development/testing, use mock data when API is not available
    if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
      console.log('Using mock data for query in development mode');
      return getMockDataForQuery(sql);
    }
    
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
      throw new Error(`Database query failed: ${response.statusText}`);
    }
    
    // Check if the response is returning PHP code instead of JSON
    const text = await response.text();
    if (text.includes('<?php')) {
      console.error('Received PHP code instead of JSON. API endpoint might not be properly configured.');
      // Return empty data for now to avoid breaking the UI
      return [];
    }
    
    try {
      // Try to parse JSON from the response text
      const data = JSON.parse(text);
      console.log('Query response:', data);
      
      if (data.error) {
        throw new Error(data.message || 'Database query failed');
      }
      
      return data.result;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response text:', text);
      // Return empty data to avoid breaking the UI
      return [];
    }
  } catch (error) {
    console.error('Query execution failed:', error);
    // Return empty array to avoid breaking the UI during development/testing
    return [];
  }
};

// Helper function to return mock data for development/testing
const getMockDataForQuery = (sql: string) => {
  console.log('SQL for mock data:', sql);
  
  // Check if it's a query for events
  if (sql.includes('FROM events')) {
    return [
      {
        id: 1,
        title: "Mock Tech Workshop",
        date: "2023-12-10",
        time: "09:00:00",
        location: "Virtual",
        price: 1500,
        is_free: 0,
        description: "A mock tech workshop for testing",
        category_id: 1,
        category_name: "Workshop",
        image_url: "/placeholder.svg",
        created_at: "2023-10-01 10:00:00"
      },
      {
        id: 2,
        title: "Mock Free Seminar",
        date: "2023-11-15",
        time: "14:00:00",
        location: "Nairobi CBD",
        price: 0,
        is_free: 1,
        description: "A mock free seminar for testing",
        category_id: 2,
        category_name: "Seminar",
        image_url: "/placeholder.svg",
        created_at: "2023-10-02 11:30:00"
      }
    ];
  }
  
  // Return empty array for other queries
  return [];
};

export default {
  query,
  testConnection
};
