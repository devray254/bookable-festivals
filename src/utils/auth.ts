
// Authentication related utilities
import { query } from './db-connection';
import { logActivity } from './logs';

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
    
    // Fall back to mock registration for demo/testing purposes
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using mock registration for testing');
      const mockId = Math.floor(Math.random() * 1000) + 100;
      return { 
        success: true, 
        id: mockId,
        user: {
          id: mockId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.userType
        }
      };
    }
    
    return { success: false, message: 'Failed to create user' };
  }
};

// Admin functions for user management
export const createAdminUser = async (userData: any, createdBy: string) => {
  console.log('Creating admin user:', userData);
  
  try {
    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    ) as any[];
    
    if (existingUsers.length > 0) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Create new admin user
    const result = await query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [userData.name, userData.email, userData.phone, userData.password, 'admin']
    ) as any;
    
    const newId = result.insertId;
    
    // Log the admin creation activity
    await logActivity({
      action: 'Admin User Creation',
      user: createdBy,
      details: `New admin user ${userData.email} created by ${createdBy}`,
      level: 'important'
    });
    
    return { 
      success: true, 
      id: newId
    };
  } catch (error) {
    console.error('Admin user creation error:', error);
    return { success: false, message: 'Failed to create admin user' };
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await query(
      'SELECT id, name, email, phone, role, organization_type FROM users ORDER BY name'
    ) as any[];
    
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Failed to fetch users' };
  }
};

// Reset user password
export const resetUserPassword = async (email: string, adminEmail: string) => {
  try {
    // In a real app, generate a secure token and send email
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 24); // 24 hour expiry
    
    // Update user with reset token
    const result = await query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [resetToken, resetTokenExpires, email]
    );
    
    // Log password reset attempt
    await logActivity({
      action: 'Password Reset Initiated',
      user: adminEmail,
      details: `Password reset initiated for ${email} by ${adminEmail}`,
      level: 'important'
    });
    
    // In a real app, this would send an email with a link containing the token
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    return { 
      success: true, 
      message: `Password reset link would be sent to ${email} in a real application.`
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: 'Failed to initiate password reset' };
  }
};

// Update user
export const updateUser = async (userId: number, userData: any, adminEmail: string) => {
  try {
    const updateFields = [];
    const updateValues = [];
    
    if (userData.name) {
      updateFields.push('name = ?');
      updateValues.push(userData.name);
    }
    
    if (userData.phone) {
      updateFields.push('phone = ?');
      updateValues.push(userData.phone);
    }
    
    if (userData.password) {
      updateFields.push('password = ?');
      updateValues.push(userData.password);
    }
    
    if (userData.role) {
      updateFields.push('role = ?');
      updateValues.push(userData.role);
    }
    
    if (updateFields.length === 0) {
      return { success: false, message: 'No fields to update' };
    }
    
    updateValues.push(userId);
    
    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Log user update
    await logActivity({
      action: 'User Update',
      user: adminEmail,
      details: `User ID ${userId} updated by ${adminEmail}`,
      level: 'info'
    });
    
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('User update error:', error);
    return { success: false, message: 'Failed to update user' };
  }
};
