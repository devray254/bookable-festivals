
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Booking } from "@/utils/bookings";
import { useQuery } from "@tanstack/react-query";
import { getAllEvents, Event } from "@/utils/events";
import { BookingFilters } from "@/components/admin/bookings/BookingFilters";
import { BookingExport } from "@/components/admin/bookings/BookingExport";

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

  const renderBookingTable = (bookingsList: typeof bookings) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Event</th>
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Tickets</th>
            <th className="text-left p-2">Total (KES)</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookingsList.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="p-2">{booking.event}</td>
              <td className="p-2">{booking.customer}</td>
              <td className="p-2">{booking.email}</td>
              <td className="p-2">{booking.phone}</td>
              <td className="p-2">{booking.date}</td>
              <td className="p-2">{booking.tickets}</td>
              <td className="p-2">{booking.total}</td>
              <td className="p-2">
                <Badge variant={
                  booking.status === "confirmed" ? "default" : 
                  booking.status === "pending" ? "secondary" : "destructive"
                }>
                  {booking.status}
                </Badge>
              </td>
              <td className="p-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">View and manage all bookings</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredBookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedBookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KES {filteredBookings.reduce((sum, booking) => sum + parseInt(booking.total), 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
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
            
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderBookingTable(filteredBookings)}
              </TabsContent>
              
              <TabsContent value="confirmed">
                {renderBookingTable(confirmedBookings)}
              </TabsContent>
              
              <TabsContent value="pending">
                {renderBookingTable(pendingBookings)}
              </TabsContent>
              
              <TabsContent value="cancelled">
                {renderBookingTable(cancelledBookings)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
