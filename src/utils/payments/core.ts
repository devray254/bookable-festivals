
import { query } from '../db-connection';
import { Payment } from './types';
import { mockPayments } from './mock-data';

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
