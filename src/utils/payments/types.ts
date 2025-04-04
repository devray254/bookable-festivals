
// Types for payment-related data

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

// Type for payment analytics
export interface PaymentAnalytics {
  totalRevenue: number;
  completedPayments: number;
  conversionRate: number;
  paymentMethods: Record<string, number>;
}
