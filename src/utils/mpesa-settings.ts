
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
    console.log('Fetching M-Pesa settings');
    
    // First try API approach
    try {
      // Use correct relative path for API endpoint
      const response = await fetch('./api/mpesa-settings.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch M-Pesa settings: ${response.status}`);
      }
      
      return await response.json();
    } catch (apiError) {
      console.error('API fetch failed, trying direct query:', apiError);
      
      // Fallback to direct query
      const settings = await query('SELECT * FROM mpesa_settings WHERE id = 1');
      
      if (settings && settings.length > 0) {
        return settings[0] as MpesaSettings;
      }
      
      // Return default settings if nothing found
      return {
        consumer_key: '',
        consumer_secret: '',
        passkey: '',
        shortcode: '',
        environment: 'sandbox',
        callback_url: 'https://example.com/callback'
      };
    }
  } catch (error) {
    console.error('Error fetching M-Pesa settings:', error);
    
    // Return default settings on error
    return {
      consumer_key: '',
      consumer_secret: '',
      passkey: '',
      shortcode: '',
      environment: 'sandbox',
      callback_url: 'https://example.com/callback'
    };
  }
};

// Update M-Pesa settings
export const updateMpesaSettings = async (settings: MpesaSettings): Promise<boolean> => {
  try {
    console.log('Updating M-Pesa settings:', {...settings, consumer_key: '***', consumer_secret: '***', passkey: '***'});
    
    // First try API approach
    try {
      // Use correct relative path for API endpoint
      const response = await fetch('./api/mpesa-settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
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
    } catch (apiError) {
      console.error('API update failed, trying direct query:', apiError);
      
      // Fallback to direct query - check if settings exist
      const existingSettings = await query('SELECT 1 FROM mpesa_settings WHERE id = 1');
      
      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        await query(
          `UPDATE mpesa_settings SET 
          consumer_key = ?, consumer_secret = ?, passkey = ?, shortcode = ?, 
          environment = ?, callback_url = ?, last_updated = NOW(), updated_by = ? 
          WHERE id = 1`,
          [
            settings.consumer_key,
            settings.consumer_secret,
            settings.passkey,
            settings.shortcode,
            settings.environment,
            settings.callback_url,
            'Admin User'
          ]
        );
      } else {
        // Insert new settings
        await query(
          `INSERT INTO mpesa_settings 
          (id, consumer_key, consumer_secret, passkey, shortcode, environment, callback_url, last_updated, updated_by)
          VALUES (1, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
          [
            settings.consumer_key,
            settings.consumer_secret,
            settings.passkey,
            settings.shortcode,
            settings.environment,
            settings.callback_url,
            'Admin User'
          ]
        );
      }
      
      return true;
    }
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
