
// Logs related utilities
import { logActivity as logActivityApi, fetchActivityLogs as fetchLogsApi } from './api';
import { query } from './db-connection';

// Use API for log activity in production, fallback to mock in development
export const logActivity = async (activity: any) => {
  console.log('Logging activity:', activity);
  
  try {
    // Try using the API first
    const apiResult = await logActivityApi(activity);
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to mock if API fails
    console.warn('API request failed, using mock data');
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await query(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, activity.action, activity.user, activity.details, activity.ip || '127.0.0.1', activity.level || 'info']
    );
    
    return { success: true, result };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, message: 'Failed to log activity' };
  }
};

// Fetch activity logs from API or mock data
export const fetchActivityLogs = async () => {
  try {
    // Try using the API first
    const logs = await fetchLogsApi();
    if (Array.isArray(logs) && logs.length > 0) {
      return logs;
    }
    
    // Fallback to mock if API fails
    console.warn('API request failed or returned empty data, using mock data');
    const mockLogs = await query(
      'SELECT * FROM activity_logs ORDER BY timestamp DESC'
    );
    
    // Ensure we always return an array of logs
    if (Array.isArray(mockLogs)) {
      return mockLogs;
    } else {
      console.error('Unexpected response format from logs query:', mockLogs);
      return [];
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};
