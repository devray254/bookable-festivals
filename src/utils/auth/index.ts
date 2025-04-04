
// Main auth entry point that re-exports all auth-related functions
import { authenticateUser, createUser } from './user-authentication';
import { createAdminUser, updateUser, resetUserPassword } from './admin-functions';
import { getAllUsers } from './user-management';

// Export all auth functions
export {
  // User authentication
  authenticateUser,
  createUser,
  
  // Admin functions
  createAdminUser,
  updateUser,
  resetUserPassword,
  
  // User management
  getAllUsers
};
