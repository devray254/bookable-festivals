
import { query } from '../db-connection';
import { logActivity } from '../logs';
import { Event } from './types';

// Create a new event
export const createEvent = async (eventData: any, adminEmail: string) => {
  try {
    console.log('Creating event:', eventData);
    
    const sql = `
      INSERT INTO events (title, description, date, time, location, is_free, price, category_id, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const isFree = eventData.priceType === "free" ? 1 : 0;
    const price = isFree ? 0 : eventData.price;
    
    const params = [
      eventData.title,
      eventData.description,
      eventData.date,
      eventData.time,
      eventData.location,
      isFree,
      price,
      eventData.category_id,
      eventData.image_url || '/placeholder.svg'
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
export const updateEvent = async (eventId: number, eventData: any, adminEmail: string) => {
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
          image_url = ?
      WHERE id = ?
    `;
    
    const isFree = eventData.priceType === "free" ? 1 : 0;
    const price = isFree ? 0 : eventData.price;
    
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
      
      return { success: true };
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
    
    // Check if the event exists first
    const checkSql = `SELECT * FROM events WHERE id = ?`;
    const event = await query(checkSql, [eventId]);
    
    if (!event || event.length === 0) {
      return { success: false, message: 'Event not found' };
    }
    
    const sql = `DELETE FROM events WHERE id = ?`;
    const result = await query(sql, [eventId]);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Event Deleted',
        user: adminEmail,
        details: `Deleted event with ID: ${eventId}`,
        level: 'important'
      });
      
      return { success: true };
    } else {
      return { success: false, message: 'Failed to delete event' };
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, message: String(error) };
  }
};
