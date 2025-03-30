
// This file serves as the main entry point for database operations
// It re-exports all functions from the specialized modules

// Test database connection
export const testConnection = async () => {
  console.log('Using mock database for frontend development');
  return true;
};

// Re-export authentication utilities
export { authenticateUser, createUser } from './auth';

// Re-export events utilities
export { fetchEvents, createEvent } from './events';

// Re-export categories utilities
export { fetchCategories, createCategory } from './categories';

// Re-export bookings utilities
export { fetchBookings } from './bookings';

// Re-export payments utilities
export { fetchPayments } from './payments';

// Re-export logs utilities
export { fetchActivityLogs, logActivity } from './logs';
