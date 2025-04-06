
import { query } from '../db-connection';
import { logActivity } from '../logs';

// Reset user password
export const resetUserPassword = async (userId: number, newPassword: string, adminEmail: string) => {
  try {
    // In a real app, we would hash the password before storing
    const hashedPassword = newPassword; // This is just a placeholder - should use proper hashing
    
    const sql = `
      UPDATE users 
      SET password = ? 
      WHERE id = ?
    `;
    
    const result = await query(sql, [hashedPassword, userId]);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Password Reset',
        user: adminEmail,
        details: `Password reset for user ID: ${userId}`,
        level: 'important'
      });
      
      return { success: true };
    } else {
      return { success: false, message: 'User not found or password not changed' };
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, message: String(error) };
  }
};
