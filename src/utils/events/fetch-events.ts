
// Functions for fetching events from the database
import { query } from '../db-connection';
import { Event, EventResponse } from './types';

// Fetch events from database
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching events from database');
    // Updated SQL query to match the actual database structure
    const events = await query(`
      SELECT e.*, c.name as category_name 
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      ORDER BY e.date DESC
    `);
    console.log('Events fetched:', events);
    return events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Get all events - explicit export to prevent runtime issues
export const getAllEvents = async (): Promise<Event[]> => {
  return await fetchEvents();
};

// Get a single event by ID
export const getEventById = async (eventId: number): Promise<EventResponse> => {
  try {
    console.log('Fetching event by ID:', eventId);
    
    const sql = `
      SELECT e.*, c.name as category_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
    `;
    
    const result = await query(sql, [eventId]);
    
    if (result && result.length > 0) {
      return { success: true, event: result[0] };
    } else {
      return { success: false, message: 'Event not found' };
    }
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return { success: false, message: String(error) };
  }
};
