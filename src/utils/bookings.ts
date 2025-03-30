
// Bookings related utilities

// Mock data for bookings
const mockBookings = [
  {
    id: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    email: "john@example.com",
    phone: "0712345678",
    date: "2023-08-15",
    tickets: 2,
    total: "1000",
    status: "confirmed"
  },
  {
    id: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "0723456789",
    date: "2023-08-20",
    tickets: 1,
    total: "750",
    status: "confirmed"
  }
];

// Fetch bookings from database
export const fetchBookings = async () => {
  return mockBookings;
};
