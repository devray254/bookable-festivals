
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
