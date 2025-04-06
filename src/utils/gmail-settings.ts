
import { query } from './db-connection';

export interface GmailSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  certificate_sender_email: string;
  certificate_email_subject: string;
  certificate_email_body: string;
  is_connected: boolean;
  access_token: string;
  refresh_token: string;
  token_expiry: string;
  enabled: boolean; // Added this property
}

// Fetch Gmail settings from database
export const fetchGmailSettings = async (): Promise<GmailSettings> => {
  try {
    // In a real app, this would fetch from the database
    // For demo purposes, we'll return mock settings
    return {
      client_id: 'mock-client-id',
      client_secret: 'mock-client-secret',
      redirect_uri: window.location.origin + '/auth/callback',
      certificate_sender_email: 'test@example.com',
      certificate_email_subject: 'Your Certificate from Maabara Online',
      certificate_email_body: 'Dear {{name}},\n\nThank you for participating in our event. Please find your certificate attached.\n\nBest regards,\nMaabara Online Team',
      is_connected: false,
      access_token: '',
      refresh_token: '',
      token_expiry: '',
      enabled: false, // Added default value
    };
  } catch (error) {
    console.error('Error fetching Gmail settings:', error);
    // Default to disabled if there's an error
    return {
      client_id: '',
      client_secret: '',
      redirect_uri: window.location.origin + '/auth/callback',
      certificate_sender_email: '',
      certificate_email_subject: 'Your Certificate from Maabara Online',
      certificate_email_body: 'Dear {{name}},\n\nThank you for participating in our event. Please find your certificate attached.\n\nBest regards,\nMaabara Online Team',
      is_connected: false,
      access_token: '',
      refresh_token: '',
      token_expiry: '',
      enabled: false, // Added default value
    };
  }
};

// Update Gmail settings
export const updateGmailSettings = async (settings: GmailSettings, adminEmail?: string) => {
  try {
    // In a real app, this would update the database
    console.log('Updating Gmail settings:', settings);
    
    // Mock successful update
    return {
      success: true,
      message: 'Gmail settings updated successfully'
    };
  } catch (error) {
    console.error('Error updating Gmail settings:', error);
    return {
      success: false,
      message: 'Failed to update Gmail settings: ' + String(error)
    };
  }
};

// Alias for saveGmailSettings to maintain backward compatibility
export const saveGmailSettings = updateGmailSettings;

// Send email using Gmail
export const sendEmailWithGmail = async (
  to: string,
  subject: string,
  body: string,
  attachmentUrl?: string,
  certificateId?: string
) => {
  try {
    // In a real app, this would use the Gmail API
    console.log(`Sending email to ${to} with subject: ${subject}`);
    
    // Mock API call
    const response = await fetch('/api/send-email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        attachmentUrl,
        certificateId
      }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to send email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email with Gmail:', error);
    return { 
      success: false, 
      message: String(error)
    };
  }
};
