
// Logs related utilities
import { query } from './db-connection';

// Log activity
export const logActivity = async (activity: any) => {
  console.log('Logging activity:', activity);
  
  try {
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

// Fetch activity logs from database
export const fetchActivityLogs = async () => {
  try {
    const logs = await query(
      'SELECT * FROM activity_logs ORDER BY timestamp DESC'
    );
    
    // Ensure we always return an array of logs
    if (Array.isArray(logs)) {
      return logs;
    } else {
      console.error('Unexpected response format from logs query:', logs);
      return [];
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};
