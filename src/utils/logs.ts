
import { query } from './db-connection';

interface ActivityLog {
  action: string;
  user: string;
  details: string;
  level: 'info' | 'warning' | 'error' | 'important';
  ip?: string;
}

// Log activity to the database
export const logActivity = async (activity: ActivityLog) => {
  try {
    // Get client IP - in a real app this would come from a server
    const ip = '127.0.0.1'; // Placeholder

    const sql = `
      INSERT INTO activity_logs 
      (timestamp, action, user, details, ip, level) 
      VALUES (NOW(), ?, ?, ?, ?, ?)
    `;
    
    const params = [
      activity.action,
      activity.user,
      activity.details,
      activity.ip || ip,
      activity.level
    ];
    
    const result = await query(sql, params);
    
    console.log('Activity logged:', activity);
    
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    // Even if logging fails, we don't want to interrupt the user flow
    return { success: false, silent: true, message: String(error) };
  }
};

// Fetch activity logs
export const fetchActivityLogs = async (limit = 100, page = 1, level?: string) => {
  try {
    let sql = `
      SELECT * FROM activity_logs 
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
    
    const offset = (page - 1) * limit;
    const params: any[] = [limit, offset];
    
    if (level) {
      sql = `
        SELECT * FROM activity_logs 
        WHERE level = ?
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
      `;
      params.unshift(level);
    }
    
    const logs = await query(sql, params);
    
    return logs || [];
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
};

// Get log count
export const getLogCount = async (level?: string) => {
  try {
    let sql = 'SELECT COUNT(*) as count FROM activity_logs';
    const params: any[] = [];
    
    if (level) {
      sql = 'SELECT COUNT(*) as count FROM activity_logs WHERE level = ?';
      params.push(level);
    }
    
    const result = await query(sql, params);
    
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error getting log count:', error);
    return 0;
  }
};

// Add the fetchLogById function that was missing
export const fetchLogById = async (id: number) => {
  try {
    const sql = 'SELECT * FROM activity_logs WHERE id = ? LIMIT 1';
    const params = [id];
    
    const result = await query(sql, params);
    
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching log by ID:', error);
    return null;
  }
};
