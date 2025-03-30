
// Categories related utilities
import { logActivity } from './logs';

// Mock data for categories
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

// Fetch categories from database
export const fetchCategories = async () => {
  return mockCategories;
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
