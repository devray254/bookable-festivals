
// User management functions
import { query } from '../db-connection';

// Get all users
export const getAllUsers = async () => {
  try {
    console.log('Fetching all users from database');
    const users = await query('SELECT id, name, email, phone, role, organization_type FROM users ORDER BY id');
    console.log('Users fetched:', users ? users.length : 0);
    
    return { 
      success: true, 
      users: users || [] 
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Fallback to mock data if database fetch fails
    console.log('Falling back to mock users data');
    const mockUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@maabara.co.ke',
        phone: '0700000000',
        role: 'admin',
        organization_type: null
      },
      {
        id: 101,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0712345678',
        role: 'attendee',
        organization_type: 'School'
      },
      {
        id: 102,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0723456789',
        role: 'attendee',
        organization_type: 'University'
      }
    ];
    
    return { success: true, message: 'Using mock data', users: mockUsers };
  }
};

// Add a new user
export const addUser = async (userData: any) => {
  try {
    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    ) as any[];
    
    if (existingUsers && existingUsers.length > 0) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Create new user
    const result = await query(
      'INSERT INTO users (name, email, phone, password, role, organization_type) VALUES (?, ?, ?, ?, ?, ?)',
      [userData.name, userData.email, userData.phone, userData.password, userData.role, userData.organization_type || null]
    ) as any;
    
    const newId = result?.insertId;
    
    if (!newId) {
      return { success: false, message: 'Failed to create user: No ID returned' };
    }
    
    // Get the newly created user
    const newUser = await query('SELECT id, name, email, phone, role, organization_type FROM users WHERE id = ?', [newId]);
    
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, message: 'Failed to add user: ' + String(error) };
  }
};

// Update an existing user
export const updateUser = async (userId: number, userData: any) => {
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
    
    if (userData.organization_type !== undefined) {
      updateFields.push('organization_type = ?');
      updateValues.push(userData.organization_type);
    }
    
    if (updateFields.length === 0) {
      return { success: false, message: 'No fields to update' };
    }
    
    updateValues.push(userId);
    
    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('User update error:', error);
    return { success: false, message: 'Failed to update user: ' + String(error) };
  }
};

// Delete a user
export const deleteUser = async (userId: number) => {
  try {
    const result = await query('DELETE FROM users WHERE id = ?', [userId]);
    
    if (result && result.affectedRows > 0) {
      return { success: true };
    } else {
      return { success: false, message: 'User not found or already deleted' };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Failed to delete user: ' + String(error) };
  }
};
