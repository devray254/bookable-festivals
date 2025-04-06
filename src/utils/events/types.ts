
// Event related type definitions
export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  price: number | string;
  is_free?: boolean;
  category_id: number;
  category_name?: string;
  image_url?: string;
  created_by?: string;
}

export interface EventResponse {
  success: boolean;
  message?: string;
  event?: Event;
  id?: number;
}
