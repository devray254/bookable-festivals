
// Define booking-related types
export interface Booking {
  id: number;
  event: string;
  event_id: number;
  customer: string;
  email: string;
  phone: string;
  date: string;
  tickets: number;
  total: string;
  status: "confirmed" | "pending" | "cancelled";
  attendance_status?: "attended" | "partial" | "absent" | "unverified";
  certificate_enabled?: boolean;
  webinar_link?: string;
  user_id?: number;
  certificate_id?: string;
}
