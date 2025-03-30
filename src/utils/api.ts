
// API utilities for making requests to the backend
const API_URL = 'http://localhost:3001/api'; // Default URL for XAMPP

// Define the type for request options
type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  [key: string]: any;
};

// Generic fetch wrapper with error handling
const fetchFromApi = async (endpoint: string, options: FetchOptions = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Log activity
export const logActivity = async (activity: any) => {
  try {
    const result = await fetchFromApi('/logs', {
      method: 'POST',
      body: JSON.stringify(activity)
    });
    return result;
  } catch (error) {
    console.error('Error logging activity via API:', error);
    return { success: false, message: 'Failed to log activity' };
  }
};

// Fetch activity logs
export const fetchActivityLogs = async () => {
  try {
    return await fetchFromApi('/logs');
  } catch (error) {
    console.error('Error fetching logs via API:', error);
    return [];
  }
};

// Test connection to the backend API
export const testApiConnection = async () => {
  try {
    const result = await fetchFromApi('/health');
    return result.connected;
  } catch (error) {
    console.error('Backend API connection test failed:', error);
    return false;
  }
};
