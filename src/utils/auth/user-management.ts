
// User management functions
import { query } from '../db-connection';

// Mock users data
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
  },
  {
    id: 103,
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '0734567890',
    role: 'attendee',
    organization_type: 'School'
  },
  {
    id: 104,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '0745678901',
    role: 'attendee',
    organization_type: 'Corporate'
  },
  {
    id: 105,
    name: 'David Brown',
    email: 'david@example.com',
    phone: '0756789012',
    role: 'attendee',
    organization_type: 'University'
  },
  {
    id: 106,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '0767890123',
    role: 'organizer',
    organization_type: 'Company'
  }
];

// Get all users
export const getAllUsers = async () => {
  try {
    // In a real application, this would query the database
    // For now, return our mock data
    
    // Make sure we return an array of users
    return { 
      success: true, 
      users: mockUsers 
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Failed to fetch users', users: [] };
  }
};

// Add a new user (mock implementation)
export const addUser = async (userData: any) => {
  try {
    // In a real application, this would insert into the database
    // For demo purposes, just pretend we added the user
    const newUser = {
      id: mockUsers.length + 100 + 1, // Generate a unique ID
      ...userData
    };
    
    // In a real application, we would add to the database
    // mockUsers.push(newUser);
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, message: 'Failed to add user' };
  }
};

// Update an existing user (mock implementation)
export const updateUser = async (userId: number, userData: any) => {
  try {
    // In a real application, this would update the database
    // For demo purposes, just pretend we updated the user
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      // In a real application, we would update in the database
      // mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      return { success: true };
    } else {
      return { success: false, message: 'User not found' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: 'Failed to update user' };
  }
};

// Delete a user (mock implementation)
export const deleteUser = async (userId: number) => {
  try {
    // In a real application, this would delete from the database
    // For demo purposes, just pretend we deleted the user
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      // In a real application, we would delete from the database
      // mockUsers.splice(userIndex, 1);
      return { success: true };
    } else {
      return { success: false, message: 'User not found' };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Failed to delete user' };
  }
};
