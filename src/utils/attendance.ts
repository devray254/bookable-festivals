
import { Booking, getBookingById, updateAttendanceStatus } from "./bookings";
import { logActivity } from "./logs";

export type AttendanceStatus = "attended" | "partial" | "absent" | "unverified";

// Mark a user's attendance status for an event
export const markAttendance = async (
  bookingId: number, 
  status: AttendanceStatus, 
  enableCertificate: boolean,
  adminEmail: string
): Promise<{success: boolean, message?: string, booking?: Booking}> => {
  try {
    // Get the current booking
    const booking = await getBookingById(bookingId);
    
    if (!booking) {
      return {
        success: false,
        message: "Booking not found"
      };
    }
    
    // Update the attendance status
    const result = await updateAttendanceStatus(bookingId, status, enableCertificate);
    
    if (!result.success) {
      return result;
    }
    
    // Log the activity
    await logActivity({
      action: "attendance_updated",
      user: adminEmail,
      details: `Updated attendance status to ${status} for booking ${bookingId}`,
      level: "info"
    });
    
    return {
      success: true,
      booking: result.booking
    };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return {
      success: false,
      message: "Error marking attendance: " + String(error)
    };
  }
};

// Get attendance statistics for an event
export const getAttendanceStats = async (eventId: number) => {
  try {
    // In a real implementation, this would query the database
    // For now, we'll return mock data
    return {
      total: 0,
      attended: 0,
      partial: 0,
      absent: 0,
      unverified: 0
    };
  } catch (error) {
    console.error("Error getting attendance stats:", error);
    return null;
  }
};

// Get a color for an attendance status (for UI display)
export const getAttendanceStatusColor = (status: AttendanceStatus | undefined): string => {
  switch (status) {
    case "attended":
      return "bg-green-100 text-green-800 border-green-300";
    case "partial":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "absent":
      return "bg-red-100 text-red-800 border-red-300";
    case "unverified":
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Get a user-friendly label for an attendance status
export const getAttendanceStatusLabel = (status: AttendanceStatus | undefined): string => {
  switch (status) {
    case "attended":
      return "Fully Attended";
    case "partial":
      return "Partially Attended";
    case "absent":
      return "Absent";
    case "unverified":
    default:
      return "Not Verified";
  }
};
