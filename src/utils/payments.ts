
import { query } from './db-connection';

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

// Fetch payments from database
export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    // Get payments from the database
    const results = await query('SELECT * FROM payments ORDER BY date DESC') as Payment[];
    return results;
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
    
    const result = await query(
      'INSERT INTO payments (id, booking_id, event, customer, phone, amount, date, method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, paymentData.booking_id, paymentData.event, paymentData.customer, paymentData.phone, paymentData.amount, date, paymentData.method, paymentData.status]
    );
    
    return { success: true, id, result };
  } catch (error) {
    console.error('Error creating payment:', error);
    return { success: false, message: 'Failed to create payment record' };
  }
};

// Update payment status
export const updatePaymentStatus = async (id: string, status: string) => {
  try {
    const result = await query(
      'UPDATE payments SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return { success: true, result };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, message: 'Failed to update payment status' };
  }
};

// Get payment details by ID
export const getPaymentById = async (id: string) => {
  try {
    const results = await query(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    ) as Payment[];
    
    if (results.length === 0) {
      return { success: false, message: 'Payment not found' };
    }
    
    return { success: true, payment: results[0] };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return { success: false, message: 'Failed to fetch payment details' };
  }
};

// Check if a user has paid for an event
export const hasUserPaidForEvent = async (phone: string, eventId: number): Promise<boolean> => {
  try {
    const results = await query(
      'SELECT p.* FROM payments p JOIN bookings b ON p.booking_id = b.id WHERE p.phone = ? AND b.event_id = ? AND p.status = "successful"',
      [phone, eventId]
    ) as Payment[];
    
    return results.length > 0;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};
