
// Authentication related utilities
import { logActivity } from './logs';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@maabara.co.ke",
    password: "admin123", // In a real app, this would be hashed
    role: "organizer"
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "attendee"
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "jane123", // In a real app, this would be hashed
    role: "attendee"
  },
  {
    id: 4,
    name: "Event Manager",
    email: "manager@maabara.co.ke",
    password: "manager123", // In a real app, this would be hashed
    role: "organizer"
  }
];

// User authentication for login
export const authenticateUser = async (email: string, password: string) => {
  console.log('Authenticating user:', email);
  
  // Find user in mock data
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }
  
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
};

// Create a new user (registration)
export const createUser = async (userData: any) => {
  console.log('Creating user:', userData);
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: 'User with this email already exists' };
  }
  
  // Create new user
  const newId = mockUsers.length + 1;
  const newUser = {
    id: newId,
    name: userData.name,
    email: userData.email,
    password: userData.password, // In a real app, this would be hashed
    role: userData.userType,
    organizationType: userData.organizationType || null
  };
  
  mockUsers.push(newUser);
  
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
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  };
};
