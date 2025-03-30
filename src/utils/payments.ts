
// Payments related utilities

// Mock data for payments
const mockPayments = [
  {
    id: "MPE123456",
    booking: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    phone: "0712345678",
    amount: "1000",
    date: "2023-08-15 14:22:30",
    method: "M-Pesa",
    status: "successful"
  },
  {
    id: "MPE234567",
    booking: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    phone: "0723456789",
    amount: "750",
    date: "2023-08-20 10:15:45",
    method: "M-Pesa",
    status: "successful"
  }
];

// Fetch payments from database
export const fetchPayments = async () => {
  return mockPayments;
};
