import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Booking } from "@/utils/bookings";
import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "@/utils/events";
import { BookingFilters } from "@/components/admin/bookings/BookingFilters";
import { BookingExport } from "@/components/admin/bookings/BookingExport";
import { BookingSummaryCards } from "@/components/admin/bookings/BookingSummaryCards";
import { BookingTabs } from "@/components/admin/bookings/BookingTabs";

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  
  // Add a fallback empty array to ensure events is never undefined
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getAllEvents
  });
  
  const bookings: Booking[] = [
    {
      id: 1,
      event: "Science Exhibition",
      event_id: 101,
      customer: "John Doe",
      email: "john@example.com",
      phone: "0712345678",
      date: "2023-08-15",
      tickets: 2,
      total: "1000",
      status: "confirmed"
    },
    {
      id: 2,
      event: "Tech Workshop",
      event_id: 102,
      customer: "Jane Smith",
      email: "jane@example.com",
      phone: "0723456789",
      date: "2023-08-20",
      tickets: 1,
      total: "750",
      status: "confirmed"
    },
    {
      id: 3,
      event: "Chemistry Seminar",
      event_id: 103,
      customer: "Mike Johnson",
      email: "mike@example.com",
      phone: "0734567890",
      date: "2023-08-25",
      tickets: 3,
      total: "900",
      status: "pending"
    },
    {
      id: 4,
      event: "Tech Workshop",
      event_id: 102,
      customer: "Sarah Williams",
      email: "sarah@example.com",
      phone: "0745678901",
      date: "2023-08-20",
      tickets: 2,
      total: "1500",
      status: "cancelled"
    }
  ];

  const filteredBookings = bookings
    .filter(booking => {
      if (activeTab !== "all") {
        return booking.status === activeTab;
      }
      return true;
    })
    .filter(booking => {
      if (selectedEventId) {
        return booking.event_id === selectedEventId;
      }
      return true;
    });

  const confirmedBookings = filteredBookings.filter(booking => booking.status === "confirmed");
  const pendingBookings = filteredBookings.filter(booking => booking.status === "pending");
  const cancelledBookings = filteredBookings.filter(booking => booking.status === "cancelled");

  const getCurrentBookings = () => {
    switch (activeTab) {
      case "confirmed": return confirmedBookings;
      case "pending": return pendingBookings;
      case "cancelled": return cancelledBookings;
      default: return filteredBookings;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">View and manage all bookings</p>
        </div>
        
        <BookingSummaryCards 
          filteredBookings={filteredBookings} 
          confirmedBookings={confirmedBookings} 
        />
        
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <BookingExport bookings={getCurrentBookings()} />
            </div>
          </CardHeader>
          <CardContent>
            <BookingFilters 
              events={events} 
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
            />
            
            <BookingTabs
              filteredBookings={filteredBookings}
              confirmedBookings={confirmedBookings}
              pendingBookings={pendingBookings}
              cancelledBookings={cancelledBookings}
              onTabChange={setActiveTab}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
