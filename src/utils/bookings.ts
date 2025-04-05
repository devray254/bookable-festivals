
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
  user_id?: number;
  attendance_status?: "attended" | "partial" | "absent" | "unverified"; // Tracking attendance status
  certificate_enabled?: boolean; // Flag to enable/disable certificate download
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
    webinar_link: "https://zoom.us/j/1234567890",
    user_id: 101,
    attendance_status: "attended",
    certificate_enabled: true
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
    webinar_link: "https://meet.google.com/abc-defg-hij",
    user_id: 102,
    attendance_status: "partial",
    certificate_enabled: false
  },
  {
    id: 3,
    event: "Science Exhibition",
    event_id: 1,
    customer: "Michael Johnson",
    email: "michael@example.com",
    phone: "0734567890",
    date: "2023-08-15",
    tickets: 1,
    total: "500",
    status: "confirmed",
    user_id: 103,
    attendance_status: "attended",
    certificate_enabled: true
  },
  {
    id: 4,
    event: "Tech Workshop",
    event_id: 2,
    customer: "Sarah Williams",
    email: "sarah@example.com",
    phone: "0745678901",
    date: "2023-08-20",
    tickets: 2,
    total: "1500",
    status: "confirmed",
    user_id: 104,
    attendance_status: "absent",
    certificate_enabled: false
  },
  {
    id: 5,
    event: "Chemistry Seminar",
    event_id: 3,
    customer: "David Brown",
    email: "david@example.com",
    phone: "0756789012",
    date: "2023-08-25",
    tickets: 1,
    total: "300",
    status: "confirmed",
    user_id: 105,
    attendance_status: "unverified",
    certificate_enabled: false
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

// Get all bookings for an event
export const getBookingsByEventId = async (eventId: number) => {
  return mockBookings.filter(b => b.event_id === eventId);
};

// Update attendance status for a booking
export const updateAttendanceStatus = async (
  bookingId: number, 
  status: "attended" | "partial" | "absent" | "unverified",
  certificateEnabled: boolean
) => {
  const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    return { success: false, message: "Booking not found" };
  }
  
  mockBookings[bookingIndex] = {
    ...mockBookings[bookingIndex],
    attendance_status: status,
    certificate_enabled: certificateEnabled
  };
  
  return { 
    success: true, 
    booking: mockBookings[bookingIndex] 
  };
};

// Get bookings for a specific user
export const getBookingsByUserId = async (userId: number) => {
  return mockBookings.filter(b => b.user_id === userId);
};
