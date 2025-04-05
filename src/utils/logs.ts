
// Logs related utilities
import { query } from './db-connection';

// Log activity directly to database
export const logActivity = async (activity: any) => {
  console.log('Logging activity:', activity);
  
  try {
    // First try via API
    const apiUrl = './api/log-activity.php';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(activity)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result;
        }
      }
    } catch (apiError) {
      console.warn('API log request failed, falling back to direct query', apiError);
    }
    
    // Fallback to direct query if API fails
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const result = await query(
      'INSERT INTO activity_logs (timestamp, action, user, details, ip, level) VALUES (?, ?, ?, ?, ?, ?)',
      [timestamp, activity.action, activity.user, activity.details, activity.ip || '127.0.0.1', activity.level || 'info']
    );
    
    return { success: true, result };
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - just return failure
    return { success: false, message: 'Failed to log activity: ' + String(error) };
  }
};

// Fetch activity logs
export const fetchActivityLogs = async () => {
  try {
    console.log('Fetching activity logs');
    
    // Try API first
    const apiUrl = './api/logs.php';
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const logs = await response.json();
        if (Array.isArray(logs) && logs.length > 0) {
          return logs;
        }
      }
    } catch (apiError) {
      console.warn('API logs request failed, falling back to direct query', apiError);
    }
    
    // Fallback to direct query
    const logs = await query(
      'SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100'
    );
    
    // Ensure we always return an array
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
};

// Fetch a specific log by ID
export const fetchLogById = async (logId: number) => {
  try {
    console.log('Fetching log details for ID:', logId);
    
    // Try API first
    const apiUrl = `./api/logs.php?id=${logId}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const log = await response.json();
        return log;
      }
    } catch (apiError) {
      console.warn('API log details request failed, falling back to direct query', apiError);
    }
    
    // Fallback to direct query
    const log = await query(
      'SELECT * FROM activity_logs WHERE id = ? LIMIT 1',
      [logId]
    );
    
    return Array.isArray(log) && log.length > 0 ? log[0] : null;
  } catch (error) {
    console.error('Error fetching log details:', error);
    return null;
  }
};
