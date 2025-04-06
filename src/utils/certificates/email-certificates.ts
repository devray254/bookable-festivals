
import { query } from '../db-connection';
import { logActivity } from '../logs';
import { generateCertificateContent } from './templates';
import { generateCertificatePDF } from '../pdf-generator';
import { sendEmailWithGmail } from '../gmail-settings';

// Send a single certificate by email
export const sendCertificateEmail = async (certificateId: string, email: string) => {
  try {
    console.log(`Sending certificate ${certificateId} to ${email}`);
    
    // Get certificate details
    const certificateResults = await query(
      `SELECT c.*, u.name as user_name, e.title as event_title, e.date as event_date 
       FROM certificates c 
       JOIN users u ON c.user_id = u.id 
       JOIN events e ON c.event_id = e.id 
       WHERE c.id = ?`,
      [certificateId]
    ) as any[];
    
    if (!certificateResults || certificateResults.length === 0) {
      return { success: false, message: 'Certificate not found' };
    }
    
    const certificate = certificateResults[0];
    
    // Generate certificate content
    const eventDate = new Date(certificate.event_date).toLocaleDateString();
    const issuedDate = new Date(certificate.issued_date).toLocaleDateString();
    
    const content = generateCertificateContent(
      certificate.user_name,
      certificate.event_title,
      eventDate,
      issuedDate
    );
    
    // Generate PDF (this would normally be saved to a file or blob)
    // In a real app, we'd save this to a temporary file or cloud storage to attach to email
    const pdfUrl = `/api/certificate-download.php?id=${certificateId}`;
    
    // Construct email body
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Certificate from ${certificate.event_title}</h2>
        <p>Dear ${certificate.user_name},</p>
        <p>Thank you for participating in our event. Please find your certificate attached to this email.</p>
        <p>You can also download your certificate directly from our website.</p>
        <p>Best regards,<br>Maabara Online Team</p>
      </div>
    `;
    
    // Send email
    const emailResult = await sendEmailWithGmail(
      email,
      `Your Certificate for ${certificate.event_title}`,
      emailBody,
      pdfUrl,
      certificateId
    );
    
    if (!emailResult.success) {
      return { success: false, message: emailResult.message || 'Failed to send email' };
    }
    
    // Update certificate as sent
    await query(
      'UPDATE certificates SET sent_email = true WHERE id = ?',
      [certificateId]
    );
    
    // Log activity
    await logActivity({
      action: 'Certificate Email',
      user: 'admin', // Ideally this should be the actual admin user
      details: `Certificate ${certificateId} sent to ${email}`,
      level: 'info'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending certificate email:', error);
    return { success: false, message: String(error) };
  }
};

// Send certificates in bulk
export const sendBulkCertificateEmails = async (eventId: number, customMessage?: string) => {
  try {
    console.log(`Sending certificates in bulk for event ${eventId}`);
    
    // Get all certificates that haven't been emailed yet
    const certificates = await query(
      `SELECT c.*, u.name as user_name, u.email as user_email, e.title as event_title, e.date as event_date 
       FROM certificates c 
       JOIN users u ON c.user_id = u.id 
       JOIN events e ON c.event_id = e.id 
       WHERE c.event_id = ? AND c.sent_email = false`,
      [eventId]
    ) as any[];
    
    if (!certificates || certificates.length === 0) {
      return { success: true, sent: 0, total: 0, message: 'No certificates to send' };
    }
    
    let sentCount = 0;
    let errorCount = 0;
    
    // Send emails one by one
    for (const certificate of certificates) {
      try {
        // Generate certificate content
        const eventDate = new Date(certificate.event_date).toLocaleDateString();
        const issuedDate = new Date(certificate.issued_date).toLocaleDateString();
        
        const content = generateCertificateContent(
          certificate.user_name,
          certificate.event_title,
          eventDate,
          issuedDate
        );
        
        // Certificate download URL
        const pdfUrl = `/api/certificate-download.php?id=${certificate.id}`;
        
        // Construct email body
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Certificate from ${certificate.event_title}</h2>
            <p>Dear ${certificate.user_name},</p>
            <p>${customMessage || 'Thank you for participating in our event. Please find your certificate attached to this email.'}</p>
            <p>You can also download your certificate directly from our website.</p>
            <p>Best regards,<br>Maabara Online Team</p>
          </div>
        `;
        
        // Send email
        const emailResult = await sendEmailWithGmail(
          certificate.user_email,
          `Your Certificate for ${certificate.event_title}`,
          emailBody,
          pdfUrl,
          certificate.id
        );
        
        if (emailResult.success) {
          // Update certificate as sent
          await query(
            'UPDATE certificates SET sent_email = true WHERE id = ?',
            [certificate.id]
          );
          
          sentCount++;
        } else {
          errorCount++;
          console.error(`Failed to send email for certificate ${certificate.id}:`, emailResult.message);
        }
      } catch (certError) {
        errorCount++;
        console.error(`Error processing certificate ${certificate.id}:`, certError);
      }
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Log bulk email activity
    await logActivity({
      action: 'Bulk Certificate Email',
      user: 'admin', // Ideally this should be the actual admin user
      details: `Sent ${sentCount} of ${certificates.length} certificates for event ${eventId}`,
      level: 'important'
    });
    
    return { 
      success: true, 
      sent: sentCount, 
      total: certificates.length,
      errors: errorCount,
      message: `Successfully sent ${sentCount} out of ${certificates.length} certificates`
    };
  } catch (error) {
    console.error('Error sending bulk certificate emails:', error);
    return { success: false, message: String(error) };
  }
};
