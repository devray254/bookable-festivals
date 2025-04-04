
import { Payment } from './types';

// Mock payments data for development
export const mockPayments: Payment[] = [
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
