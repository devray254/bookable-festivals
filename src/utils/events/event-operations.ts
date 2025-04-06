
import { query } from "../db-connection";
import { EventResponse, Event } from "./types";
import { logActivity } from "../logs";

export const deleteEvent = async (eventId: number, adminEmail: string): Promise<EventResponse> => {
  try {
    console.log(`Deleting event with ID: ${eventId}`);
    
    // In a real app, we'd call an API to delete the event
    await query(`DELETE FROM events WHERE id = ?`, [eventId]);
    
    // Log activity
    await logActivity({
      action: 'Delete Event',
      user: adminEmail,
      details: `Event ID ${eventId} was deleted`,
      level: 'important'
    });
    
    return { success: true, message: "Event deleted successfully" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, message: String(error) };
  }
};

export const updateEvent = async (eventId: number, eventData: Partial<Event>): Promise<EventResponse> => {
  try {
    console.log(`Updating event with ID: ${eventId}`, eventData);
    
    // Ensure we don't try to update the ID
    const { id, ...dataToUpdate } = eventData;
    
    // Check if the event exists
    const existingEvents = await query(`SELECT * FROM events WHERE id = ?`, [eventId]);
    if (!existingEvents || existingEvents.length === 0) {
      return { success: false, message: "Event not found" };
    }
    
    // Check if it's a past event (don't allow updating past events)
    const existingEvent = existingEvents[0];
    const eventDate = new Date(existingEvent.date);
    const now = new Date();
    
    if (eventDate < now) {
      return { success: false, message: "Cannot update past events" };
    }
    
    // In a real app, we'd call an API to update the event
    // Create SQL update set clause
    const fields = Object.keys(dataToUpdate);
    const values = Object.values(dataToUpdate);
    
    if (fields.length === 0) {
      return { success: false, message: "No data provided for update" };
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE events SET ${setClause} WHERE id = ?`;
    
    // Add ID to the end of values for the WHERE clause
    values.push(eventId);
    
    await query(sql, values);
    
    // Log activity
    await logActivity({
      action: 'Update Event',
      user: dataToUpdate.created_by || 'admin',
      details: `Event ID ${eventId} (${dataToUpdate.title || 'Unknown'}) was updated`,
      level: 'important'
    });
    
    return { 
      success: true, 
      message: "Event updated successfully",
      id: eventId
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, message: String(error) };
  }
};
