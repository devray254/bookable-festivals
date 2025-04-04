
// User management functions
import { query } from '../db-connection';

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await query(
      'SELECT id, name, email, phone, role, organization_type FROM users ORDER BY name'
    ) as any[];
    
    // Make sure we return an array of users
    return { 
      success: true, 
      users: Array.isArray(users) ? users : [] 
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Failed to fetch users', users: [] };
  }
};
