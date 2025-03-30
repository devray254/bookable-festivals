
// Authentication related utilities
import { query } from './db-connection';
import { logActivity } from './logs';

// User authentication for login
export const authenticateUser = async (email: string, password: string) => {
  console.log('Authenticating user:', email);
  
  try {
    // In a production app, you would compare hashed passwords
    const users = await query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    ) as any[];
    
    if (users.length === 0) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    const user = users[0];
    
    // Log the login activity
    await logActivity({
      action: 'User Login',
      user: email,
      details: `User logged in successfully as ${user.role}`,
      level: 'info'
    });
    
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
};

// Create a new user (registration)
export const createUser = async (userData: any) => {
  console.log('Creating user:', userData);
  
  try {
    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    ) as any[];
    
    if (existingUsers.length > 0) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Create new user
    // In a production app, you would hash the password
    const result = await query(
      'INSERT INTO users (name, email, password, role, organization_type) VALUES (?, ?, ?, ?, ?)',
      [userData.name, userData.email, userData.password, userData.userType, userData.organizationType || null]
    ) as any;
    
    const newId = result.insertId;
    
    // Log the registration activity
    await logActivity({
      action: 'User Registration',
      user: userData.email,
      details: `New ${userData.userType} account created`,
      level: 'info'
    });
    
    return { 
      success: true, 
      id: newId,
      user: {
        id: newId,
        name: userData.name,
        email: userData.email,
        role: userData.userType
      }
    };
  } catch (error) {
    console.error('User creation error:', error);
    return { success: false, message: 'Failed to create user' };
  }
};
