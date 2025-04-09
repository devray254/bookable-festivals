
import { Booking } from './types';

// Function to calculate booking statistics
export const getBookingStatistics = (bookings: Booking[]) => {
  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, booking) => sum + parseInt(booking.total), 0);
  
  return {
    total,
    confirmed,
    pending,
    cancelled,
    totalRevenue
  };
};
