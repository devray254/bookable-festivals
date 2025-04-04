
import { fetchPayments } from './core';
import { fetchBookings } from '../bookings';

// Function to check if a user has paid for an event
export const hasUserPaidForEvent = async (phone: string, eventId: number): Promise<boolean> => {
  try {
    // In a real app, this would query the payments table
    const payments = await fetchPayments();
    const bookings = await fetchBookings();
    
    // Find booking with matching phone number and event ID
    const booking = bookings.find(b => b.phone === phone && b.event_id === eventId);
    
    if (!booking) {
      return false;
    }
    
    // Check if there's a successful payment for this booking
    const payment = payments.find(p => 
      p.booking_id === booking.id && 
      p.status === 'completed'
    );
    
    return !!payment;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};

// Get all users who have paid for a specific event
export const getPaidUsersForEvent = async (eventId: number): Promise<number[]> => {
  try {
    const payments = await fetchPayments();
    
    // Filter payments for the specific event with completed status
    const paidUsers = payments
      .filter(payment => 
        payment.event_id === eventId && 
        payment.status === 'completed'
      )
      .map(payment => payment.user_id);
    
    // Remove duplicates (in case a user has multiple payments)
    return [...new Set(paidUsers)];
  } catch (error) {
    console.error('Error getting paid users for event:', error);
    return [];
  }
};
