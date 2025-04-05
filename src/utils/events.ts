
// Events related utilities
import { query } from './db-connection';
import { logActivity } from './logs';

// Fetch events from database
export const fetchEvents = async () => {
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

// Create a new event
export const createEvent = async (eventData: any, adminEmail: string) => {
  try {
    console.log('Creating event:', eventData);
    
    const sql = `
      INSERT INTO events (title, description, date, time, location, price, is_free, category_id, image_url, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Set price to 0 for free events
    const isFree = eventData.priceType === 'free' || Number(eventData.price) === 0;
    const price = isFree ? 0 : eventData.price;
    
    const params = [
      eventData.title,
      eventData.description || '',
      eventData.date,
      eventData.time || '00:00:00',
      eventData.location,
      price,
      isFree ? 1 : 0,
      eventData.category_id,
      eventData.image_url || '/placeholder.svg',
      adminEmail
    ];
    
    const result = await query(sql, params);
    
    if (result && result.insertId) {
      // Log the activity
      await logActivity({
        action: 'Event Created',
        user: adminEmail,
        details: `Created new event: ${eventData.title} (${isFree ? 'Free' : 'Paid: KES ' + price})`,
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
    
    const sql = `
      UPDATE events 
      SET title = ?, description = ?, date = ?, time = ?, location = ?, price = ?, 
          is_free = ?, category_id = ?, image_url = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    // Set price to 0 for free events
    const isFree = eventData.priceType === 'free' || Number(eventData.price) === 0;
    const price = isFree ? 0 : eventData.price;
    
    const params = [
      eventData.title,
      eventData.description || '',
      eventData.date,
      eventData.time || '00:00:00',
      eventData.location,
      price,
      isFree ? 1 : 0,
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
        details: `Updated event: ${eventData.title} (${isFree ? 'Free' : 'Paid: KES ' + price})`,
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
    
    // First get the event details for logging
    const eventDetails = await query('SELECT title FROM events WHERE id = ?', [eventId]);
    const eventTitle = eventDetails[0]?.title || 'Unknown event';
    
    const sql = 'DELETE FROM events WHERE id = ?';
    const result = await query(sql, [eventId]);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Event Deleted',
        user: adminEmail,
        details: `Deleted event: ${eventTitle} (ID: ${eventId})`,
        level: 'warning'
      });
      
      return { success: true };
    } else {
      return { success: false, message: 'Event not found or already deleted' };
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, message: String(error) };
  }
};

// Get a single event by ID
export const getEventById = async (eventId: number) => {
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
