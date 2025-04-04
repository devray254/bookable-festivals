
// Bookings related utilities

// Interface for booking data
export interface Booking {
  id: number;
  event: string;
  event_id: number;
  customer: string;
  email: string;
  phone: string;
  date: string;
  tickets: number;
  total: string;
  status: string;
  webinar_link?: string;
}

// Mock data for bookings
const mockBookings: Booking[] = [
  {
    id: 1,
    event: "Science Exhibition",
    event_id: 1,
    customer: "John Doe",
    email: "john@example.com",
    phone: "0712345678",
    date: "2023-08-15",
    tickets: 2,
    total: "1000",
    status: "confirmed",
    webinar_link: "https://zoom.us/j/1234567890"
  },
  {
    id: 2,
    event: "Tech Workshop",
    event_id: 2,
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "0723456789",
    date: "2023-08-20",
    tickets: 1,
    total: "750",
    status: "confirmed",
    webinar_link: "https://meet.google.com/abc-defg-hij"
  }
];

// Fetch bookings from database
export const fetchBookings = async () => {
  return mockBookings;
};

// Get booking by ID
export const getBookingById = async (id: number) => {
  const booking = mockBookings.find(b => b.id === id);
  return booking || null;
};

// Get booking by phone number
export const getBookingByPhone = async (phone: string, eventId: number) => {
  const booking = mockBookings.find(b => b.phone === phone && b.event_id === eventId);
  return booking || null;
};
