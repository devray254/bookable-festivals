
import { fetchPayments } from './core';
import { fetchBookings } from '../bookings';
import { PaymentAnalytics } from './types';

// Function to get payment analytics
export const getPaymentAnalytics = async (): Promise<PaymentAnalytics> => {
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
