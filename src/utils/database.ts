
import { query } from './db-connection';
import { fetchEvents } from './events';
import { logActivity } from './logs';
import { resetUserPassword } from './auth/user-authentication';

// Test the database connection
export const testDatabaseConnection = async () => {
  try {
    // Simple query to test connection
    await query('SELECT 1');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, message: String(error) };
  }
};

// Export events functions
export { 
  fetchEvents
};

// Export the categories functions from the categories file
export { 
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './categories';

// Export auth functions
export {
  resetUserPassword
};
