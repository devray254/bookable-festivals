
// Main auth entry point that re-exports all auth-related functions
import { authenticateUser, createUser } from './user-authentication';
import { createAdminUser, updateUser, resetUserPassword } from './admin-functions';
import { getAllUsers, addUser } from './user-management';
import { authenticateWithGmail, linkGmailAccount } from './gmail-authentication';

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
  getAllUsers,
  addUser,
  
  // Gmail authentication
  authenticateWithGmail,
  linkGmailAccount
};
