
import { query } from '../db-connection';
import { logActivity } from '../logs';
import { fetchGmailSettings } from '../gmail-settings';

// Authenticate user with Gmail
export const authenticateWithGmail = async (gmailToken: string) => {
  console.log('Authenticating user with Gmail token');
  
  try {
    // Check if Gmail integration is enabled
    const gmailSettings = await fetchGmailSettings();
    if (!gmailSettings || !gmailSettings.enabled) {
      return { success: false, message: 'Gmail authentication is not enabled' };
    }
    
    // In a real implementation, this would verify the token with Google's API
    // For now, we'll simulate the verification process
    
    // Extract email from token (this is just a simulation)
    const gmailEmail = await simulateGmailTokenVerification(gmailToken);
    
    if (!gmailEmail) {
      return { success: false, message: 'Invalid Gmail token' };
    }
    
    // Check if user exists with this Gmail email
    const users = await query(
      'SELECT id, name, email, phone, role FROM users WHERE email = ?',
      [gmailEmail]
    ) as any[];
    
    if (users.length === 0) {
      // User doesn't exist, create a new user
      return {
        success: false,
        message: 'No account found with this Gmail address',
        newUser: true,
        email: gmailEmail
      };
    }
    
    const user = users[0];
    
    // Log the login activity
    try {
      await logActivity({
        action: 'Gmail Login',
        user: gmailEmail,
        details: `User logged in with Gmail as ${user.role}`,
        level: 'info'
      });
    } catch (logError) {
      console.warn('Failed to log activity, but continuing login process:', logError);
    }
    
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Gmail authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
};

// Link Gmail account to existing user
export const linkGmailAccount = async (userId: number, gmailToken: string) => {
  console.log('Linking Gmail account for user ID:', userId);
  
  try {
    // Check if Gmail integration is enabled
    const gmailSettings = await fetchGmailSettings();
    if (!gmailSettings || !gmailSettings.enabled) {
      return { success: false, message: 'Gmail integration is not enabled' };
    }
    
    // In a real implementation, this would verify the token with Google's API
    const gmailEmail = await simulateGmailTokenVerification(gmailToken);
    
    if (!gmailEmail) {
      return { success: false, message: 'Invalid Gmail token' };
    }
    
    // Update user with Gmail info
    await query(
      'UPDATE users SET gmail_email = ? WHERE id = ?',
      [gmailEmail, userId]
    );
    
    // Log the activity
    await logActivity({
      action: 'Gmail Account Linked',
      user: gmailEmail,
      details: `User ID ${userId} linked Gmail account ${gmailEmail}`,
      level: 'info'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error linking Gmail account:', error);
    return { success: false, message: String(error) };
  }
};

// This is a simulation function - in a real implementation, this would call Google's API
const simulateGmailTokenVerification = async (token: string): Promise<string | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, extract email from token (in real app, we would verify with Google API)
    if (token && token.includes('@')) {
      return token; // Using the token itself as the email for demo
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying Gmail token:', error);
    return null;
  }
};
