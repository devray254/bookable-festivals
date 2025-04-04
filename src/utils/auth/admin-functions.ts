
// Admin-specific authentication functions
import { query } from '../db-connection';
import { logActivity } from '../logs';

// Create a new admin user
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
