
// Define event-related types

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  is_free: number;
  category_id: number;
  category_name?: string;
  image_url?: string;
  has_webinar?: number | boolean; // Updated to support both number and boolean
  webinar_link?: string;
  webinar_time?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  available_tickets?: number; // Added this property
}

export interface EventResponse {
  success: boolean;
  event?: Event;
  message?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  priceType: "free" | "paid";
  price?: number | string; // Updated to accept string or number
  category_id: number;
  image_url?: string;
  has_webinar?: boolean;
  webinar_link?: string;
  webinar_time?: string;
  created_by?: string; // Added created_by field
}

export interface UpdateEventData extends CreateEventData {
  id: number;
  created_by?: string; // Added to match usage in EditEventDialog
}
