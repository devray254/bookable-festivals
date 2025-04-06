
// Main auth entry point that re-exports all auth-related functions
import { resetUserPassword } from './user-authentication';
import { createAdminUser, updateUser } from './admin-functions';
import { getAllUsers, addUser, updateUser as updateUserManagement, deleteUser } from './user-management';
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
  deleteUser,
  
  // Gmail authentication
  authenticateWithGmail,
  linkGmailAccount
};

// Add these exports for backward compatibility with other code using these functions
// Export authenticateWithGmail as authenticateUser for backward compatibility
export const authenticateUser = authenticateWithGmail;
export const createUser = addUser;
