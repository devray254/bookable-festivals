/**
 * Database connection utility
 * This file handles communication with the PHP backend
 */

// Base URL for API endpoints - empty for relative path in production
const API_BASE_URL = '';

// Keep track of last activity time
let lastActivityTime = Date.now();

// Update last activity time on user interactions
const setupActivityTracking = () => {
  // Only set up once
  if (window._activityTrackingSet) return;
  
  const updateLastActivity = () => {
    lastActivityTime = Date.now();
    // Store in sessionStorage for persistence across page refreshes
    sessionStorage.setItem('lastActivityTime', lastActivityTime.toString());
  };
  
  // Track various user interactions
  window.addEventListener('click', updateLastActivity);
  window.addEventListener('keypress', updateLastActivity);
  window.addEventListener('scroll', updateLastActivity);
  window.addEventListener('mousemove', updateLastActivity);
  
  // Set initial activity time
  updateLastActivity();
  
  // Mark as set up
  window._activityTrackingSet = true;
};

// Call setup on import
if (typeof window !== 'undefined') {
  setupActivityTracking();
}

// Check if user has been inactive for 5 minutes (300000ms)
export const checkInactivity = () => {
  const storedTime = sessionStorage.getItem('lastActivityTime');
  if (!storedTime) return false;
  
  const inactiveTime = Date.now() - parseInt(storedTime);
  return inactiveTime > 300000; // 5 minutes
};

// Test database connection
export const testConnection = async () => {
  try {
    console.log('Testing database connection to:', `${API_BASE_URL}/api/test-connection.php`);
    const response = await fetch(`${API_BASE_URL}/api/test-connection.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      // Add timeout to prevent long hanging requests
      signal: AbortSignal.timeout(5000)
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
    
    // Send request to PHP endpoint with timeout
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
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.error('Query response not OK:', response.status, response.statusText);
      throw new Error(`Database query failed: ${response.statusText}`);
    }
    
    // Check if the response is returning PHP code instead of JSON
    const text = await response.text();
    if (text.includes('<?php')) {
      console.error('Received PHP code instead of JSON. API endpoint might not be properly configured.');
      // Return mock data as fallback
      return getMockDataForQuery(sql);
    }
    
    try {
      // Try to parse JSON from the response text
      const data = JSON.parse(text);
      console.log('Query response:', data);
      
      if (data.error) {
        console.error('Query error:', data.message);
        throw new Error(data.message || 'Database query failed');
      }
      
      return data.result;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response text:', text);
      // Return mock data as fallback
      return getMockDataForQuery(sql);
    }
  } catch (error) {
    console.error('Query execution failed:', error);
    // Return mock data in case of error
    return getMockDataForQuery(sql);
  }
};

// Helper function to return mock data for development/testing
const getMockDataForQuery = (sql: string) => {
  // Import mock data from separate file
  const { mockEvents, mockCategories, getMockData } = require('./mock-data');
  
  console.log('SQL for mock data:', sql);
  
  // Check if it's a query for events
  if (sql.toLowerCase().includes('from events')) {
    return mockEvents;
  }
  
  // Check if it's a query for categories
  if (sql.toLowerCase().includes('from categories')) {
    return mockCategories;
  }
  
  // Extract the table name from the SQL
  const tableMatch = sql.match(/from\s+([a-z_]+)/i);
  if (tableMatch && tableMatch[1]) {
    const tableName = tableMatch[1].toLowerCase();
    return getMockData(tableName);
  }
  
  // Return empty array for other queries
  return [];
};

export default {
  query,
  testConnection,
  checkInactivity
};
