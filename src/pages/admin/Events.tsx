
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventsList } from "@/components/admin/events/EventsList";
import { AddEventDialog } from "@/components/admin/events/AddEventDialog";
import { DbConnectionTester } from "@/components/admin/database/DbConnectionTester";
import { fetchEvents } from "@/utils/events";
import { toast } from "sonner";
import { RefreshCw, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDbTester, setShowDbTester] = useState(true);
  
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
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.category_name && event.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Count free events
  const freeEvents = events.filter(e => Number(e.price) === 0).length;

  // Count paid events
  const paidEvents = events.filter(e => Number(e.price) > 0).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage your events here</p>
        </div>
        
        {showDbTester && (
          <div className="mb-6">
            <DbConnectionTester />
            <div className="mt-2 text-right">
              <button 
                className="text-sm text-blue-500 hover:underline" 
                onClick={() => setShowDbTester(false)}
              >
                Hide connection tester
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <h3 className="text-2xl font-bold">{events.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {events.length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <h3 className="text-2xl font-bold">
                    {events.filter(e => new Date(e.date) > new Date()).length}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {events.filter(e => new Date(e.date) > new Date()).length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Free Events</p>
                  <h3 className="text-2xl font-bold">{freeEvents}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  {freeEvents}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Events</p>
                  <h3 className="text-2xl font-bold">{paidEvents}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  {paidEvents}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search events..." 
                  className="pl-8 w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                events={filteredEvents} 
                onEventsChanged={loadEvents} 
                isLoading={loading}
                adminEmail={adminEmail}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
