
// This file contains utilities to interact with mock database (for frontend use)
// In a real application, these functions would call a backend API

// Mock data for development
const mockEvents = [
  {
    id: 1,
    title: "Science Exhibition",
    date: "2023-08-15",
    location: "Main Hall",
    category: "Science",
    price: "500",
    description: "Explore the wonders of science with interactive displays and demonstrations."
  },
  {
    id: 2,
    title: "Tech Workshop",
    date: "2023-08-20",
    location: "Lab 2",
    category: "Technology",
    price: "750",
    description: "Learn about the latest technologies and how to use them in your projects."
  }
];

const mockCategories = [
  {
    id: 1,
    name: "Science",
    description: "Scientific exhibitions and events",
    events: 8
  },
  {
    id: 2,
    name: "Technology",
    description: "Technology workshops and seminars",
    events: 12
  }
];

const mockBookings = [
  {
    id: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    email: "john@example.com",
    phone: "0712345678",
    date: "2023-08-15",
    tickets: 2,
    total: "1000",
    status: "confirmed"
  },
  {
    id: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "0723456789",
    date: "2023-08-20",
    tickets: 1,
    total: "750",
    status: "confirmed"
  }
];

const mockPayments = [
  {
    id: "MPE123456",
    booking: 1,
    event: "Science Exhibition",
    customer: "John Doe",
    phone: "0712345678",
    amount: "1000",
    date: "2023-08-15 14:22:30",
    method: "M-Pesa",
    status: "successful"
  },
  {
    id: "MPE234567",
    booking: 2,
    event: "Tech Workshop",
    customer: "Jane Smith",
    phone: "0723456789",
    amount: "750",
    date: "2023-08-20 10:15:45",
    method: "M-Pesa",
    status: "successful"
  }
];

const mockLogs = [
  {
    id: 1,
    timestamp: "2023-08-25 09:30:45",
    action: "Event Created",
    user: "admin@maabara.co.ke",
    details: "Created new event: Science Exhibition",
    ip: "192.168.1.1",
    level: "info"
  },
  {
    id: 2,
    timestamp: "2023-08-25 10:15:22",
    action: "Payment Completed",
    user: "john@example.com",
    details: "Payment for Science Exhibition successful",
    ip: "192.168.1.15",
    level: "info"
  }
];

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
  }
];

// Test database connection
export const testConnection = async () => {
  console.log('Using mock database for frontend development');
  return true;
};

// Fetch events from database
export const fetchEvents = async () => {
  return mockEvents;
};

// Fetch categories from database
export const fetchCategories = async () => {
  return mockCategories;
};

// Fetch bookings from database
export const fetchBookings = async () => {
  return mockBookings;
};

// Fetch payments from database
export const fetchPayments = async () => {
  return mockPayments;
};

// Fetch activity logs from database
export const fetchActivityLogs = async () => {
  return mockLogs;
};

// Create a new event
export const createEvent = async (eventData: any) => {
  console.log('Creating event:', eventData);
  
  // Simulate successful creation
  const newId = mockEvents.length + 1;
  const newEvent = {
    id: newId,
    ...eventData
  };
  
  mockEvents.push(newEvent);
  
  // Log the activity
  await logActivity({
    action: 'Event Created',
    user: 'admin@maabara.co.ke',
    details: `Created new event: ${eventData.title}`,
    level: 'info'
  });
  
  return { success: true, id: newId };
};

// Create a new category
export const createCategory = async (categoryData: any) => {
  console.log('Creating category:', categoryData);
  
  // Simulate successful creation
  const newId = mockCategories.length + 1;
  const newCategory = {
    id: newId,
    ...categoryData,
    events: 0
  };
  
  mockCategories.push(newCategory);
  
  // Log the activity
  await logActivity({
    action: 'Category Created',
    user: 'admin@maabara.co.ke',
    details: `Created new category: ${categoryData.name}`,
    level: 'info'
  });
  
  return { success: true, id: newId };
};

// Log activity
export const logActivity = async (activity: any) => {
  console.log('Logging activity:', activity);
  
  const newId = mockLogs.length + 1;
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  const newLog = {
    id: newId,
    timestamp,
    ip: "127.0.0.1",
    ...activity
  };
  
  mockLogs.unshift(newLog);
  
  return { success: true };
};

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
    details: 'User logged in successfully',
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
  
  return { success: true, id: newId };
};
