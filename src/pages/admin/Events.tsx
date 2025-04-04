
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventsList } from "@/components/admin/events/EventsList";
import { AddEventDialog } from "@/components/admin/events/AddEventDialog";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  price: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Science Exhibition",
      date: "2023-08-15",
      location: "Main Hall",
      category: "Science",
      price: "500"
    },
    {
      id: 2,
      title: "Tech Workshop",
      date: "2023-08-20",
      location: "Lab 2",
      category: "Technology",
      price: "750"
    },
    {
      id: 3,
      title: "Chemistry Seminar",
      date: "2023-08-25",
      location: "Lecture Room",
      category: "Science",
      price: "300"
    }
  ]);
  
  const handleEventAdded = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Manage your events here</p>
          </div>
          <AddEventDialog onEventAdded={handleEventAdded} />
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <EventsList events={events} />
        </div>
      </div>
    </AdminLayout>
  );
}
