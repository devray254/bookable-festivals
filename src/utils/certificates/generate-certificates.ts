
import { getBookingById, getBookingsByEventId } from "../bookings";
import { logActivity } from "../logs";
import { getPaidUsersForEvent } from "../payments/verification";

// Generate a unique ID for certificates
const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${randomStr}`.toUpperCase();
};

// Generate a certificate for a user for an event
export const generateCertificate = async (eventId: number, userId: number, adminEmail: string) => {
  try {
    // First, check if the user has paid for the event
    const paidUsers = await getPaidUsersForEvent(eventId);
    if (!paidUsers.includes(userId)) {
      return {
        success: false,
        message: "User has not paid for this event"
      };
    }
    
    // Then check booking and attendance status
    const bookings = await getBookingsByEventId(eventId);
    const userBooking = bookings.find(b => b.user_id === userId);
    
    if (!userBooking) {
      return {
        success: false,
        message: "User has not booked for this event"
      };
    }
    
    // Check if attendance is marked and certificate is allowed
    if (userBooking.attendance_status !== 'attended' && !userBooking.certificate_enabled) {
      return {
        success: false,
        message: "Certificate generation not allowed: User did not fully attend the event"
      };
    }
    
    // Generate certificate ID
    const certificateId = generateUniqueId();
    
    // Log the activity
    await logActivity({
      action: "certificate_generated",
      user: adminEmail,
      details: `Generated certificate ${certificateId} for user ${userId} for event ${eventId}`,
      level: "info"
    });
    
    // In a real implementation, you would save the certificate to the database
    return {
      success: true,
      certificateId: certificateId,
      message: "Certificate generated successfully"
    };
  } catch (error) {
    console.error("Error generating certificate:", error);
    return {
      success: false,
      message: "Error generating certificate: " + String(error)
    };
  }
};

// Generate certificates in bulk for all paid users of an event
export const generateBulkCertificates = async (eventId: number, adminEmail: string) => {
  try {
    // Get all users who have paid for the event
    const paidUsers = await getPaidUsersForEvent(eventId);
    
    if (paidUsers.length === 0) {
      return {
        success: false,
        message: "No users have paid for this event",
        generated: 0,
        total: 0
      };
    }
    
    // Generate certificates only for eligible users (those who attended)
    let successCount = 0;
    
    // Get all bookings for this event to check attendance
    const bookings = await getBookingsByEventId(eventId);
    const eligibleUsers = bookings
      .filter(booking => 
        // Include users who fully attended or have been explicitly enabled
        (booking.attendance_status === 'attended' || booking.certificate_enabled) &&
        // And have paid
        paidUsers.includes(booking.user_id || 0)
      )
      .map(booking => booking.user_id);
    
    // Generate certificates for eligible users
    for (const userId of eligibleUsers) {
      if (userId) {
        const result = await generateCertificate(eventId, userId, adminEmail);
        if (result.success) {
          successCount++;
        }
      }
    }
    
    // Log the activity
    await logActivity({
      action: "certificates_bulk_generated",
      user: adminEmail,
      details: `Generated ${successCount} certificates for event ${eventId}`,
      level: "info"
    });
    
    return {
      success: true,
      message: `Generated ${successCount} certificates out of ${paidUsers.length} users`,
      generated: successCount,
      total: paidUsers.length
    };
  } catch (error) {
    console.error("Error generating bulk certificates:", error);
    return {
      success: false,
      message: "Error generating bulk certificates: " + String(error),
      generated: 0,
      total: 0
    };
  }
};
