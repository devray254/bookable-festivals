
import { query } from './db-connection';

interface GmailSettings {
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scope?: string;
}

// Fetch Gmail settings from database
export const fetchGmailSettings = async (): Promise<GmailSettings> => {
  try {
    // In a real app, this would fetch from the database
    // For demo purposes, we'll return mock settings
    return {
      enabled: true,
      clientId: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      redirectUri: window.location.origin + '/auth/callback',
      scope: 'email profile'
    };
  } catch (error) {
    console.error('Error fetching Gmail settings:', error);
    // Default to disabled if there's an error
    return {
      enabled: false
    };
  }
};

// Update Gmail settings
export const updateGmailSettings = async (settings: GmailSettings, adminEmail: string) => {
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

// Alias for saveGmailSettings to fix the error in GmailSettingsForm
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
