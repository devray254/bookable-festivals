
// This file serves as the main entry point for database operations
// It re-exports all functions from the specialized modules

// Test database connection
export { testConnection } from './db-connection';

// Re-export authentication utilities
export { 
  authenticateUser, 
  createUser,
  createAdminUser,
  updateUser,
  resetUserPassword,
  getAllUsers
} from './auth';

// Re-export events utilities
export { fetchEvents, createEvent } from './events';

// Re-export categories utilities
export { fetchCategories, createCategory } from './categories';

// Re-export bookings utilities
export { fetchBookings } from './bookings';

// Re-export payments utilities
export { fetchPayments } from './payments/core';

// Re-export logs utilities
export { fetchActivityLogs, logActivity } from './logs';

// Re-export image upload utilities
export { uploadEventImage, validateImage } from './image-upload';
