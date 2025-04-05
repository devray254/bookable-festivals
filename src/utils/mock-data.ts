
/**
 * Mock data utility for development and testing
 * This provides fallback data when the backend is not available
 */

// Mock categories
export const mockCategories = [
  { id: 1, name: 'Workshop', description: 'Hands-on learning experiences' },
  { id: 2, name: 'Seminar', description: 'Educational presentations and discussions' },
  { id: 3, name: 'Conference', description: 'Industry conferences and events' },
  { id: 4, name: 'Exhibition', description: 'Showcases and exhibitions' },
  { id: 5, name: 'Hackathon', description: 'Competitive coding and problem solving' }
];

// Mock events
export const mockEvents = [
  {
    id: 1,
    title: "Tech Workshop 2023",
    description: "A comprehensive hands-on workshop on the latest technologies",
    date: "2023-12-10",
    time: "09:00:00",
    location: "Maabara Labs, Nairobi",
    price: 1500,
    is_free: 0,
    category_id: 1,
    category_name: "Workshop",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2023-10-01 10:00:00",
    updated_at: "2023-10-01 10:00:00"
  },
  {
    id: 2,
    title: "Free AI Seminar",
    description: "Learn about the latest advancements in artificial intelligence",
    date: "2023-11-15",
    time: "14:00:00",
    location: "Virtual Event",
    price: 0,
    is_free: 1,
    category_id: 2,
    category_name: "Seminar",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2023-10-02 11:30:00",
    updated_at: "2023-10-02 11:30:00"
  },
  {
    id: 3,
    title: "Annual Tech Conference",
    description: "The largest technology conference in East Africa",
    date: "2023-12-01",
    time: "08:00:00",
    location: "KICC, Nairobi",
    price: 3000,
    is_free: 0,
    category_id: 3,
    category_name: "Conference",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2023-10-03 09:15:00",
    updated_at: "2023-10-03 09:15:00"
  },
  {
    id: 4,
    title: "Innovation Exhibition",
    description: "Showcase of innovative projects from across the region",
    date: "2024-01-20",
    time: "10:00:00",
    location: "University of Nairobi",
    price: 500,
    is_free: 0,
    category_id: 4,
    category_name: "Exhibition",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2023-10-04 14:45:00",
    updated_at: "2023-10-04 14:45:00"
  },
  {
    id: 5,
    title: "Coding Hackathon",
    description: "48-hour coding challenge for developers",
    date: "2024-02-15",
    time: "18:00:00",
    location: "iHub, Nairobi",
    price: 1000,
    is_free: 0,
    category_id: 5,
    category_name: "Hackathon",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2023-10-05 16:30:00",
    updated_at: "2023-10-05 16:30:00"
  },
  {
    id: 6,
    title: "Women in Tech Workshop",
    description: "Special workshop focused on empowering women in technology",
    date: "2023-11-25",
    time: "10:00:00",
    location: "Strathmore University, Nairobi",
    price: 0,
    is_free: 1,
    category_id: 1,
    category_name: "Workshop",
    image_url: "/placeholder.svg",
    created_by: "admin@maabara.co.ke",
    created_at: "2023-10-06 11:00:00",
    updated_at: "2023-10-06 11:00:00"
  }
];

// Mock users
export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@maabara.co.ke",
    phone: "0700000000",
    role: "admin",
    created_at: "2023-09-01 10:00:00"
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "0712345678",
    role: "attendee",
    created_at: "2023-09-02 11:30:00"
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0723456789",
    role: "attendee",
    created_at: "2023-09-03 14:15:00"
  }
];

// Mock bookings
export const mockBookings = [
  {
    id: 1,
    event_id: 1,
    user_id: 2,
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "0712345678",
    booking_date: "2023-10-15 09:30:00",
    tickets: 2,
    total_amount: 3000,
    status: "confirmed",
    webinar_access: false,
    attendance_status: "unverified",
    created_at: "2023-10-15 09:30:00"
  },
  {
    id: 2,
    event_id: 2,
    user_id: 3,
    customer_name: "Jane Smith",
    customer_email: "jane@example.com",
    customer_phone: "0723456789",
    booking_date: "2023-10-16 14:45:00",
    tickets: 1,
    total_amount: 0,
    status: "confirmed",
    webinar_access: true,
    attendance_status: "unverified",
    created_at: "2023-10-16 14:45:00"
  }
];

// Function to get mock data based on entity type
export const getMockData = (entity: string) => {
  switch (entity) {
    case 'events':
      return mockEvents;
    case 'categories':
      return mockCategories;
    case 'users':
      return mockUsers;
    case 'bookings':
      return mockBookings;
    default:
      return [];
  }
};

export default {
  mockEvents,
  mockCategories,
  mockUsers,
  mockBookings,
  getMockData
};
