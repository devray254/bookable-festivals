
// User management functions
import { query } from '../db-connection';

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await query(
      'SELECT id, name, email, phone, role, organization_type FROM users ORDER BY name'
    ) as any[];
    
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Failed to fetch users' };
  }
};
