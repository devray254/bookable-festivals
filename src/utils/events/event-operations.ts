
import { query } from '../db-connection';
import { logActivity } from '../logs';
import { Event, CreateEventData, UpdateEventData } from './types';
import { createCrudOperations } from '../database';

// Define allowed fields for CRUD operations
const eventFields = [
  'title', 'description', 'date', 'time', 'location', 
  'is_free', 'price', 'category_id', 'image_url', 'has_webinar', 
  'webinar_link', 'webinar_time', 'created_by'
];

// Create standard CRUD operations
export const eventOperations = createCrudOperations<Event>('events', 'id', eventFields);

// Create a new event
export const createEvent = async (eventData: CreateEventData, adminEmail: string) => {
  try {
    console.log('Creating event:', eventData);
    
    const sql = `
      INSERT INTO events (title, description, date, time, location, is_free, price, category_id, image_url, has_webinar, webinar_link, webinar_time, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const isFree = eventData.priceType === "free" ? 1 : 0;
    const price = isFree ? 0 : eventData.price || 0;
    const hasWebinar = eventData.has_webinar ? 1 : 0;
    
    const params = [
      eventData.title,
      eventData.description,
      eventData.date,
      eventData.time,
      eventData.location,
      isFree,
      price,
      eventData.category_id,
      eventData.image_url || '/placeholder.svg',
      hasWebinar,
      eventData.webinar_link || null,
      eventData.webinar_time || null,
      adminEmail
    ];
    
    const result = await query(sql, params);
    
    if (result && result.insertId) {
      // Log the activity
      await logActivity({
        action: 'Event Created',
        user: adminEmail,
        details: `Created new event: ${eventData.title}`,
        level: 'info'
      });
      
      return { success: true, id: result.insertId };
    } else {
      return { success: false, message: 'Failed to create event' };
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, message: String(error) };
  }
};

// Update an existing event
export const updateEvent = async (eventId: number, eventData: UpdateEventData, adminEmail: string) => {
  try {
    console.log('Updating event:', eventId, eventData);
    
    // First, check if event has passed
    const today = new Date();
    const eventDate = new Date(eventData.date);
    
    if (eventDate < today) {
      return { 
        success: false, 
        message: 'Cannot update past events. This event has already occurred.' 
      };
    }
    
    const sql = `
      UPDATE events 
      SET title = ?, description = ?, date = ?, time = ?, 
          location = ?, is_free = ?, price = ?, category_id = ?, 
          image_url = ?, has_webinar = ?, webinar_link = ?, webinar_time = ?
      WHERE id = ?
    `;
    
    const isFree = eventData.priceType === "free" ? 1 : 0;
    const price = isFree ? 0 : eventData.price || 0;
    const hasWebinar = eventData.has_webinar ? 1 : 0;
    
    const params = [
      eventData.title,
      eventData.description,
      eventData.date,
      eventData.time,
      eventData.location,
      isFree,
      price,
      eventData.category_id,
      eventData.image_url || '/placeholder.svg',
      hasWebinar,
      eventData.webinar_link || null,
      eventData.webinar_time || null,
      eventId
    ];
    
    const result = await query(sql, params);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Event Updated',
        user: adminEmail,
        details: `Updated event: ${eventData.title} (ID: ${eventId})`,
        level: 'info'
      });
      
      return { success: true, message: 'Event updated successfully' };
    } else {
      return { success: false, message: 'Failed to update event or no changes made' };
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, message: String(error) };
  }
};

// Delete an event
export const deleteEvent = async (eventId: number, adminEmail: string) => {
  try {
    console.log('Deleting event:', eventId);
    
    // First get the event details for logging
    const event = await query('SELECT title FROM events WHERE id = ?', [eventId]);
    const eventTitle = event && event.length > 0 ? event[0].title : 'Unknown event';
    
    // Check if the event exists
    if (!event || event.length === 0) {
      return { success: false, message: 'Event not found' };
    }
    
    // Check if event has any bookings
    const bookings = await query('SELECT COUNT(*) as count FROM bookings WHERE event_id = ?', [eventId]);
    if (bookings && bookings[0].count > 0) {
      return { 
        success: false, 
        message: `Cannot delete event "${eventTitle}" because it has ${bookings[0].count} bookings` 
      };
    }
    
    const sql = `DELETE FROM events WHERE id = ?`;
    const result = await query(sql, [eventId]);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Event Deleted',
        user: adminEmail,
        details: `Deleted event: ${eventTitle} (ID: ${eventId})`,
        level: 'important'
      });
      
      return { success: true, message: 'Event deleted successfully' };
    } else {
      return { success: false, message: 'Failed to delete event' };
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, message: String(error) };
  }
};

// Get events by category
export const getEventsByCategory = async (categoryId: number) => {
  try {
    console.log('Fetching events by category:', categoryId);
    
    const sql = `
      SELECT e.*, c.name as category_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.category_id = ?
      ORDER BY e.date DESC
    `;
    
    const results = await query(sql, [categoryId]);
    return results || [];
  } catch (error) {
    console.error('Error fetching events by category:', error);
    return [];
  }
};

// Get upcoming events
export const getUpcomingEvents = async (limit = 5) => {
  try {
    console.log('Fetching upcoming events, limit:', limit);
    
    const today = new Date().toISOString().split('T')[0];
    
    const sql = `
      SELECT e.*, c.name as category_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.date >= ?
      ORDER BY e.date ASC
      LIMIT ?
    `;
    
    const results = await query(sql, [today, limit]);
    return results || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

// Get featured events - this could be used on the homepage
export const getFeaturedEvents = async (limit = 3) => {
  try {
    console.log('Fetching featured events, limit:', limit);
    
    // This is just a simple implementation - in a real app, you might have a featured flag
    const sql = `
      SELECT e.*, c.name as category_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      ORDER BY RAND()
      LIMIT ?
    `;
    
    const results = await query(sql, [limit]);
    return results || [];
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
};
