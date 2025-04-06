
import { query } from './db-connection';
import { 
  fetchEvents, 
  fetchEvent, 
  fetchFeaturedEvents, 
  searchEvents 
} from './events';
import { logActivity } from './logs';

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
  fetchEvents, 
  fetchEvent, 
  fetchFeaturedEvents, 
  searchEvents 
};
