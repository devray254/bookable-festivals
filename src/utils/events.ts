
// Events related utilities
import { logActivity } from './logs';

// Mock data for events
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

// Fetch events from database
export const fetchEvents = async () => {
  return mockEvents;
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
