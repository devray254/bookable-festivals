
// Booking type definition
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
  status: "confirmed" | "pending" | "cancelled";
  attendance_status?: "attended" | "partial" | "absent" | "unverified";
  certificate_enabled?: boolean;
  webinar_link?: string;
  user_id?: number;
  certificate_id?: string;
}

// Function to fetch bookings from the API
export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch('/api/bookings.php');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Function to create a new booking
export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<{success: boolean, id?: number, message?: string}> => {
  try {
    const response = await fetch('/api/create-booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return {success: false, message: String(error)};
  }
};

// Function to update a booking status
export const updateBookingStatus = async (
  id: number, 
  status: "confirmed" | "pending" | "cancelled"
): Promise<{success: boolean, message?: string}> => {
  try {
    const response = await fetch('/api/update-booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, status}),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating booking:', error);
    return {success: false, message: String(error)};
  }
};

// Function to get bookings by event
export const getBookingsByEvent = async (eventId: number): Promise<Booking[]> => {
  try {
    const response = await fetch(`/api/bookings.php?event_id=${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by event:', error);
    return [];
  }
};

// Function to get bookings by status
export const getBookingsByStatus = async (status: string): Promise<Booking[]> => {
  try {
    const response = await fetch(`/api/bookings.php?status=${status}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    return [];
  }
};

// Function to calculate booking statistics
export const getBookingStatistics = (bookings: Booking[]) => {
  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;
  
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, booking) => sum + parseInt(booking.total), 0);
  
  return {
    total,
    confirmed,
    pending,
    cancelled,
    totalRevenue
  };
};

// Function to get bookings by event ID (alias for getBookingsByEvent for consistent naming)
export const getBookingsByEventId = async (eventId: number): Promise<Booking[]> => {
  return getBookingsByEvent(eventId);
};

// Function to get a booking by ID
export const getBookingById = async (bookingId: number): Promise<Booking | null> => {
  try {
    const response = await fetch(`/api/bookings.php?id=${bookingId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }
    const bookings = await response.json();
    return bookings.length > 0 ? bookings[0] : null;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    return null;
  }
};

// Function to get bookings by user ID
export const getBookingsByUserId = async (userId: number): Promise<Booking[]> => {
  try {
    const response = await fetch(`/api/bookings.php?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by user ID:', error);
    return [];
  }
};

// Function to get a booking by phone number and event
export const getBookingByPhone = async (phoneNumber: string, eventId: number): Promise<Booking | null> => {
  try {
    const response = await fetch(`/api/bookings.php?phone=${phoneNumber}&event_id=${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking by phone');
    }
    const bookings = await response.json();
    return bookings.length > 0 ? bookings[0] : null;
  } catch (error) {
    console.error('Error fetching booking by phone:', error);
    return null;
  }
};

// Function to update attendance status and certificate eligibility
export const updateAttendanceStatus = async (
  bookingId: number,
  status: "attended" | "partial" | "absent" | "unverified",
  enableCertificate: boolean,
  adminEmail: string
): Promise<{success: boolean, message?: string, booking?: Booking}> => {
  try {
    const response = await fetch('/api/update-attendance.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        status,
        enableCertificate,
        adminEmail
      }),
    });
    
    const data = await response.json();
    
    // If successful, return the updated booking
    if (data.success && data.booking) {
      return {
        success: true,
        booking: data.booking
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error updating attendance status:', error);
    return {
      success: false,
      message: String(error)
    };
  }
};
