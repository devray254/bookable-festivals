
import { query } from './db-connection';
import { fetchBookings, Booking } from './bookings';

// Mock payments data for development
const mockPayments = [
  {
    id: 1,
    booking_id: 101,
    user_id: 102,
    event_id: 1,
    amount: 750,
    payment_method: 'M-Pesa',
    transaction_id: 'MPE123456789',
    status: 'completed',
    created_at: '2023-07-18T10:24:36',
    user_name: 'Jane Smith',
    event_title: 'Science Exhibition'
  },
  {
    id: 2,
    booking_id: 102,
    user_id: 103,
    event_id: 1,
    amount: 750,
    payment_method: 'M-Pesa',
    transaction_id: 'MPE987654321',
    status: 'completed',
    created_at: '2023-07-19T14:15:22',
    user_name: 'Michael Johnson',
    event_title: 'Science Exhibition'
  },
  {
    id: 3,
    booking_id: 103,
    user_id: 104,
    event_id: 2,
    amount: 500,
    payment_method: 'M-Pesa',
    transaction_id: 'MPE456789123',
    status: 'completed',
    created_at: '2023-07-20T09:45:12',
    user_name: 'Sarah Williams',
    event_title: 'Tech Workshop'
  },
  {
    id: 4,
    booking_id: 104,
    user_id: 105,
    event_id: 3,
    amount: 300,
    payment_method: 'M-Pesa',
    transaction_id: 'MPE789123456',
    status: 'completed',
    created_at: '2023-07-21T16:30:45',
    user_name: 'David Brown',
    event_title: 'Chemistry Seminar'
  },
  {
    id: 5,
    booking_id: 105,
    user_id: 106,
    event_id: 2,
    amount: 500,
    payment_method: 'Cash',
    transaction_id: 'CASH001',
    status: 'completed',
    created_at: '2023-07-22T11:20:18',
    user_name: 'Emily Davis',
    event_title: 'Tech Workshop'
  }
];

// Type definitions for payments
export interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  event_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  user_name?: string;
  event_title?: string;
}

// Fetch payments
export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    // In a real app, this would query the database
    const payments = await query(
      `SELECT p.*, u.name as user_name, e.title as event_title 
       FROM payments p 
       JOIN users u ON p.user_id = u.id 
       JOIN events e ON p.event_id = e.id 
       ORDER BY p.created_at DESC`
    ) as Payment[];
    
    if (!payments || payments.length === 0) {
      console.log('No payments found in database, using mock data');
      return mockPayments;
    }
    
    return payments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    console.log('Using mock payment data due to error');
    return mockPayments;
  }
};

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

// Function to get payment analytics
export const getPaymentAnalytics = async () => {
  try {
    const payments = await fetchPayments();
    const bookings = await fetchBookings();
    
    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => 
      payment.status === 'completed' ? sum + payment.amount : sum, 0
    );
    
    // Count completed payments
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    
    // Calculate conversion rate (bookings that led to payments)
    const conversionRate = bookings.length > 0 
      ? (completedPayments / bookings.length) * 100 
      : 0;
    
    // Group payments by method
    const paymentMethods = payments.reduce((acc, payment) => {
      if (!acc[payment.payment_method]) {
        acc[payment.payment_method] = 0;
      }
      if (payment.status === 'completed') {
        acc[payment.payment_method]++;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalRevenue,
      completedPayments,
      conversionRate,
      paymentMethods
    };
  } catch (error) {
    console.error('Error calculating payment analytics:', error);
    return {
      totalRevenue: 0,
      completedPayments: 0,
      conversionRate: 0,
      paymentMethods: {}
    };
  }
};
