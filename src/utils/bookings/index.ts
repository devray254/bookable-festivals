
// Main entry point that re-exports all booking-related functions
import { Booking } from './types';
import { 
  fetchBookings,
  getBookingsByEvent,
  getBookingsByStatus,
  getBookingsByEventId,
  getBookingById,
  getBookingsByUserId,
  getBookingByPhone
} from './fetch';
import {
  createBooking,
  updateBookingStatus,
  updateAttendanceStatus
} from './create-update';
import { getBookingStatistics } from './analytics';

// Export all types
export type { Booking };

// Export all functions
export {
  // Fetch functions
  fetchBookings,
  getBookingsByEvent,
  getBookingsByStatus,
  getBookingsByEventId,
  getBookingById,
  getBookingsByUserId,
  getBookingByPhone,
  
  // Create and update functions
  createBooking,
  updateBookingStatus,
  updateAttendanceStatus,
  
  // Analytics functions
  getBookingStatistics
};
