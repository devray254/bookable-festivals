
// Main auth entry point that re-exports all auth-related functions
import { resetUserPassword } from './user-authentication';
import { createAdminUser, updateUser } from './admin-functions';
import { getAllUsers, addUser } from './user-management';
import { authenticateWithGmail, linkGmailAccount } from './gmail-authentication';

// Export all auth functions
export {
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
