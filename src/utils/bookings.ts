
import { createCrudOperations } from './database';
import { query } from './db-connection';

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

// Create CRUD operations for bookings
const bookingFields = [
  'event_id', 'user_id', 'customer_name', 'customer_email', 'customer_phone',
  'booking_date', 'tickets', 'total_amount', 'status', 'webinar_access',
  'attendance_status', 'certificate_enabled'
];

export const bookingsOperations = createCrudOperations<Booking>('bookings', 'id', bookingFields);

// Additional specialized booking functions

// Fetch bookings from database
export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const sql = `
      SELECT b.*, e.title as event, u.name as customer
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC
    `;
    
    const result = await query(sql);
    return result || mockBookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return mockBookings;
  }
};

// Get booking by ID
export const getBookingById = async (id: number): Promise<Booking | null> => {
  try {
    const sql = `
      SELECT b.*, e.title as event, u.name as customer
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `;
    
    const result = await query(sql, [id]);
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    const booking = mockBookings.find(b => b.id === id);
    return booking || null;
  }
};

// Get booking by phone number
export const getBookingByPhone = async (phone: string, eventId: number): Promise<Booking | null> => {
  try {
    const sql = `
      SELECT b.*, e.title as event, u.name as customer
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.customer_phone = ? AND b.event_id = ?
    `;
    
    const result = await query(sql, [phone, eventId]);
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching booking by phone:', error);
    const booking = mockBookings.find(b => b.phone === phone && b.event_id === eventId);
    return booking || null;
  }
};

// Get all bookings for an event
export const getBookingsByEventId = async (eventId: number): Promise<Booking[]> => {
  try {
    const sql = `
      SELECT b.*, e.title as event, u.name as customer
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.event_id = ?
      ORDER BY b.booking_date DESC
    `;
    
    const result = await query(sql, [eventId]);
    return result || mockBookings.filter(b => b.event_id === eventId);
  } catch (error) {
    console.error('Error fetching bookings by event ID:', error);
    return mockBookings.filter(b => b.event_id === eventId);
  }
};

// Update attendance status for a booking
export const updateAttendanceStatus = async (
  bookingId: number, 
  status: "attended" | "partial" | "absent" | "unverified",
  certificateEnabled: boolean,
  adminEmail: string
) => {
  try {
    const sql = `
      UPDATE bookings
      SET attendance_status = ?, certificate_enabled = ?
      WHERE id = ?
    `;
    
    const result = await query(sql, [status, certificateEnabled ? 1 : 0, bookingId]);
    
    if (result && result.affectedRows > 0) {
      // Get the updated booking
      const updatedBooking = await getBookingById(bookingId);
      
      // Log the activity
      const { logActivity } = await import('./logs');
      await logActivity({
        action: 'Attendance Updated',
        user: adminEmail,
        details: `Updated attendance status to "${status}" for booking #${bookingId}`,
        level: 'info'
      });
      
      return { 
        success: true, 
        booking: updatedBooking 
      };
    } else {
      return { success: false, message: "Booking not found" };
    }
  } catch (error) {
    console.error('Error updating attendance status:', error);
    
    // For mock data
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
  }
};

// Get bookings for a specific user
export const getBookingsByUserId = async (userId: number): Promise<Booking[]> => {
  try {
    const sql = `
      SELECT b.*, e.title as event, u.name as customer
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `;
    
    const result = await query(sql, [userId]);
    return result || mockBookings.filter(b => b.user_id === userId);
  } catch (error) {
    console.error('Error fetching bookings by user ID:', error);
    return mockBookings.filter(b => b.user_id === userId);
  }
};
