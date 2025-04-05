
// User authentication functions
import { query } from '../db-connection';
import { logActivity } from '../logs';

// User authentication for login
export const authenticateUser = async (email: string, password: string) => {
  console.log('Authenticating user:', email);
  
  try {
    // In a production app, you would compare hashed passwords
    const users = await query(
      'SELECT id, name, email, phone, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    ) as any[];
    
    if (users.length === 0) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    const user = users[0];
    
    // Log the login activity
    try {
      await logActivity({
        action: 'User Login',
        user: email,
        details: `User logged in successfully as ${user.role}`,
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
    console.error('Authentication error:', error);
    
    // For development/demo purposes: if database connection fails, allow admin login with hardcoded credentials
    if (email === 'admin@maabara.co.ke' && password === 'admin123') {
      console.log('Using fallback admin authentication');
      return { 
        success: true, 
        user: {
          id: 1,
          name: 'Admin User',
          email: 'admin@maabara.co.ke',
          phone: '0700000000',
          role: 'admin'
        }
      };
    }
    
    return { success: false, message: 'Authentication failed' };
  }
};

// Create a new user (registration)
export const createUser = async (userData: any) => {
  console.log('Creating user:', { ...userData, password: "***" });
  
  try {
    // Check if user already exists
    try {
      const existingUsers = await query(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      ) as any[];
      
      if (existingUsers && existingUsers.length > 0) {
        return { success: false, message: 'User with this email already exists' };
      }
    } catch (checkError) {
      console.error('Error checking existing user:', checkError);
      // Continue with registration attempt even if check fails
    }
    
    // Create new user
    // In a production app, you would hash the password
    const result = await query(
      'INSERT INTO users (name, email, phone, password, role, organization_type) VALUES (?, ?, ?, ?, ?, ?)',
      [userData.name, userData.email, userData.phone, userData.password, userData.userType, userData.organizationType || null]
    ) as any;
    
    const newId = result?.insertId || Math.floor(Math.random() * 1000) + 100; // Fallback ID if not provided
    
    // Log the registration activity (but don't fail if logging fails)
    try {
      await logActivity({
        action: 'User Registration',
        user: userData.email,
        details: `New ${userData.userType} account created`,
        level: 'info'
      });
    } catch (logError) {
      console.warn('Failed to log activity, but continuing registration process:', logError);
    }
    
    return { 
      success: true, 
      id: newId,
      user: {
        id: newId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.userType
      }
    };
  } catch (error) {
    console.error('User creation error:', error);
    return { success: false, message: 'Failed to create user: ' + String(error) };
  }
};
