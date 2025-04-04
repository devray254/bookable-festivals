
import { query } from './db-connection';

export interface MpesaSettings {
  consumer_key: string;
  consumer_secret: string;
  passkey: string;
  shortcode: string;
  environment: 'sandbox' | 'production';
  callback_url: string;
}

// Fetch M-Pesa settings
export const getMpesaSettings = async (): Promise<MpesaSettings | null> => {
  try {
    const response = await fetch('/api/mpesa-settings.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch M-Pesa settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching M-Pesa settings:', error);
    return null;
  }
};

// Update M-Pesa settings
export const updateMpesaSettings = async (settings: MpesaSettings): Promise<boolean> => {
  try {
    const response = await fetch('/api/mpesa-settings.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...settings,
        updated_by: 'Admin User' // In a real app, get from user session
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update M-Pesa settings');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating M-Pesa settings:', error);
    throw error;
  }
};

// Get the base URL for M-Pesa API based on the environment
export const getMpesaApiBaseUrl = (environment: 'sandbox' | 'production'): string => {
  return environment === 'sandbox' 
    ? 'https://sandbox.safaricom.co.ke' 
    : 'https://api.safaricom.co.ke';
};
