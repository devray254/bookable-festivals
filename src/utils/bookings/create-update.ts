
import { Booking } from './types';

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
