
import { query } from './db-connection';
import { logActivity } from './logs';

interface GmailSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  enabled: boolean;
}

export const fetchGmailSettings = async (): Promise<GmailSettings | undefined> => {
  try {
    console.log('Fetching Gmail settings');
    
    const settings = await query(
      'SELECT * FROM settings WHERE category = ?',
      ['gmail']
    ) as any[];
    
    if (!settings || settings.length === 0) {
      return undefined;
    }
    
    // Convert settings array to object
    const settingsObj: Record<string, any> = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    return {
      client_id: settingsObj.client_id || '',
      client_secret: settingsObj.client_secret || '',
      redirect_uri: settingsObj.redirect_uri || '',
      enabled: settingsObj.enabled === '1' || false
    };
  } catch (error) {
    console.error('Error fetching Gmail settings:', error);
    return undefined;
  }
};

export const saveGmailSettings = async (settings: GmailSettings): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('Saving Gmail settings:', { ...settings, client_secret: '***' });
    
    // First check if settings exist
    const existingSettings = await query(
      'SELECT * FROM settings WHERE category = ? AND `key` = ?',
      ['gmail', 'client_id']
    ) as any[];
    
    const settingsExist = existingSettings && existingSettings.length > 0;
    
    // Prepare settings for database
    const settingsToSave = [
      { category: 'gmail', key: 'client_id', value: settings.client_id },
      { category: 'gmail', key: 'client_secret', value: settings.client_secret },
      { category: 'gmail', key: 'redirect_uri', value: settings.redirect_uri },
      { category: 'gmail', key: 'enabled', value: settings.enabled ? '1' : '0' }
    ];
    
    // Begin transaction
    await query('START TRANSACTION');
    
    for (const setting of settingsToSave) {
      if (settingsExist) {
        // Update existing
        await query(
          'UPDATE settings SET value = ? WHERE category = ? AND `key` = ?',
          [setting.value, setting.category, setting.key]
        );
      } else {
        // Insert new
        await query(
          'INSERT INTO settings (category, `key`, value) VALUES (?, ?, ?)',
          [setting.category, setting.key, setting.value]
        );
      }
    }
    
    // Commit transaction
    await query('COMMIT');
    
    // Log activity
    await logActivity({
      action: 'Gmail Settings Update',
      user: 'admin', // Ideally this should be the actual admin user
      details: 'Gmail integration settings were updated',
      level: 'important'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving Gmail settings:', error);
    
    // Rollback transaction
    try {
      await query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Error rolling back transaction:', rollbackError);
    }
    
    return { success: false, message: String(error) };
  }
};

export const sendEmailWithGmail = async (
  to: string, 
  subject: string, 
  body: string, 
  attachmentUrl?: string,
  certificateId?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log(`Sending email to ${to} with subject "${subject}"`);
    
    // In a real implementation, this would use the Gmail API
    const response = await fetch('/api/send-email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        attachmentUrl,
        certificateId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to send email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: String(error) };
  }
};
