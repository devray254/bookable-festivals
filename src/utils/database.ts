
// This file contains utilities to interact with the MySQL database
// In a production environment, these would connect to backend APIs

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

// Database configuration - replace with actual config when connecting to real MySQL
const dbConfig: DatabaseConfig = {
  host: "localhost",
  user: "maabara_user",
  password: "secure_password",
  database: "maabara_db"
};

// Simulated API calls for front-end development purposes
// In production, these would be replaced with actual API calls to a backend server

export const fetchEvents = async () => {
  console.log('Fetching events from database', dbConfig);
  // This is a simulation - in production, this would be an actual API call
  return mockEvents;
};

export const fetchCategories = async () => {
  console.log('Fetching categories from database', dbConfig);
  // This is a simulation - in production, this would be an actual API call
  return mockCategories;
};

export const fetchBookings = async () => {
  console.log('Fetching bookings from database', dbConfig);
  // This is a simulation - in production, this would be an actual API call
  return mockBookings;
};

export const fetchPayments = async () => {
  console.log('Fetching payments from database', dbConfig);
  // This is a simulation - in production, this would be an actual API call
  return mockPayments;
};

export const fetchActivityLogs = async () => {
  console.log('Fetching activity logs from database', dbConfig);
  // This is a simulation - in production, this would be an actual API call
  return mockLogs;
};

export const createEvent = async (eventData: any) => {
  console.log('Creating event in database', eventData);
  // This is a simulation - in production, this would be an actual API call
  return { success: true, id: Math.floor(Math.random() * 1000) };
};

export const createCategory = async (categoryData: any) => {
  console.log('Creating category in database', categoryData);
  // This is a simulation - in production, this would be an actual API call
  return { success: true, id: Math.floor(Math.random() * 1000) };
};

export const logActivity = async (activity: any) => {
  console.log('Logging activity', activity);
  // This is a simulation - in production, this would be an actual API call
  return { success: true };
};

// Mock data for development
const mockEvents = [
  {
    id: 1,
    title: "Science Exhibition",
    date: "2023-08-15",
    location: "Main Hall",
    category: "Science",
    price: "500"
  },
  {
    id: 2,
    title: "Tech Workshop",
    date: "2023-08-20",
    location: "Lab 2",
    category: "Technology",
    price: "750"
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
