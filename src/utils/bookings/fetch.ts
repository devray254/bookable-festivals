
import { Booking } from './types';

// Function to fetch bookings from the API
export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch('/api/bookings.php');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Function to get bookings by event
export const getBookingsByEvent = async (eventId: number): Promise<Booking[]> => {
  try {
    const response = await fetch(`/api/bookings.php?event_id=${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by event:', error);
    return [];
  }
};

// Function to get bookings by status
export const getBookingsByStatus = async (status: string): Promise<Booking[]> => {
  try {
    const response = await fetch(`/api/bookings.php?status=${status}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    return [];
  }
};

// Function to get bookings by event ID (alias for getBookingsByEvent for consistent naming)
export const getBookingsByEventId = async (eventId: number): Promise<Booking[]> => {
  return getBookingsByEvent(eventId);
};

// Function to get a booking by ID
export const getBookingById = async (bookingId: number): Promise<Booking | null> => {
  try {
    const response = await fetch(`/api/bookings.php?id=${bookingId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking');
    }
    const bookings = await response.json();
    return bookings.length > 0 ? bookings[0] : null;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    return null;
  }
};

// Function to get bookings by user ID
export const getBookingsByUserId = async (userId: number): Promise<Booking[]> => {
  try {
    const response = await fetch(`/api/bookings.php?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by user ID:', error);
    return [];
  }
};

// Function to get a booking by phone number and event
export const getBookingByPhone = async (phoneNumber: string, eventId: number): Promise<Booking | null> => {
  try {
    const response = await fetch(`/api/bookings.php?phone=${phoneNumber}&event_id=${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch booking by phone');
    }
    const bookings = await response.json();
    return bookings.length > 0 ? bookings[0] : null;
  } catch (error) {
    console.error('Error fetching booking by phone:', error);
    return null;
  }
};
