
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventsList } from "@/components/admin/events/EventsList";
import { AddEventDialog } from "@/components/admin/events/AddEventDialog";
import { fetchEvents } from "@/utils/events";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category_id: number;
  category_name?: string;
  price: string | number;
  image_url?: string;
  description?: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  
  // Get admin email from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.email) {
      setAdminEmail(user.email);
    }
  }, []);
  
  // Load events from database
  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };
  
  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);
  
  const handleEventAdded = () => {
    loadEvents(); // Reload events after adding a new one
    toast.success("Event added successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Manage your events here</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={loadEvents}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Refresh events"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <AddEventDialog onEventAdded={handleEventAdded} adminEmail={adminEmail} />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <EventsList 
            events={events} 
            onEventsChanged={loadEvents} 
            isLoading={loading}
            adminEmail={adminEmail}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
