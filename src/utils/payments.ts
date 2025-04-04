import { query } from './db-connection';
import { Booking } from './bookings';

// Interface for payment data
interface Payment {
  id: string;
  booking_id: number;
  event: string;
  customer: string;
  phone: string;
  amount: string;
  date: string;
  method: string;
  status: string;
}

// Mock payment data that matches our bookings
const mockPayments: Payment[] = [
  {
    id: "MP12345",
    booking_id: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    phone: "0712345678",
    amount: "1000",
    date: "2023-08-14T10:30:00",
    method: "mpesa",
    status: "successful"
  },
  {
    id: "MP23456",
    booking_id: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    phone: "0723456789",
    amount: "750",
    date: "2023-08-18T14:45:00",
    method: "mpesa",
    status: "successful"
  },
  {
    id: "MP34567",
    booking_id: 3,
    event: "Science Exhibition",
    customer: "Michael Johnson",
    phone: "0734567890",
    amount: "500",
    date: "2023-08-14T11:15:00",
    method: "mpesa",
    status: "successful"
  },
  {
    id: "MP45678",
    booking_id: 4,
    event: "Tech Workshop",
    customer: "Sarah Williams",
    phone: "0745678901",
    amount: "1500",
    date: "2023-08-19T09:30:00",
    method: "mpesa",
    status: "successful"
  },
  {
    id: "MP56789",
    booking_id: 5,
    event: "Chemistry Seminar",
    customer: "David Brown",
    phone: "0756789012",
    amount: "300",
    date: "2023-08-24T16:20:00",
    method: "mpesa",
    status: "successful"
  }
];

// Fetch payments from database
export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    // In a real app, this would query the database
    // For now, return mock data
    return mockPayments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    
    // Return empty array on error
    return [];
  }
};

// Create a new payment record
export const createPayment = async (paymentData: Omit<Payment, 'id' | 'date'>) => {
  try {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const id = `MP${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // In a real app, this would insert into the database
    // For now, just log it
    console.log('Creating payment:', { id, ...paymentData, date });
    
    return { success: true, id, result: null };
  } catch (error) {
    console.error('Error creating payment:', error);
    return { success: false, message: 'Failed to create payment record' };
  }
};

// Update payment status
export const updatePaymentStatus = async (id: string, status: string) => {
  try {
    // In a real app, this would update the database
    console.log('Updating payment status:', id, status);
    
    return { success: true, result: null };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, message: 'Failed to update payment status' };
  }
};

// Get payment details by ID
export const getPaymentById = async (id: string) => {
  try {
    const payment = mockPayments.find(p => p.id === id);
    
    if (!payment) {
      return { success: false, message: 'Payment not found' };
    }
    
    return { success: true, payment };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return { success: false, message: 'Failed to fetch payment details' };
  }
};

// Check if a user has paid for an event
export const hasUserPaidForEvent = async (phone: string, eventId: number): Promise<boolean> => {
  try {
    // In a real app, this would check the database
    // For our mock data, check if there's a payment with matching phone and event
    const payment = mockPayments.find(p => {
      // Import the bookings to access the bookings data
      const bookings = await import('./bookings').then(m => m.fetchBookings());
      const booking = bookings.find(b => b.id === p.booking_id);
      return p.phone === phone && booking && booking.event_id === eventId && p.status === "successful";
    });
    
    return !!payment;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};
