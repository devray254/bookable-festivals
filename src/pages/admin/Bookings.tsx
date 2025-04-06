
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToExcel, exportToPDF } from "@/utils/exports";
import { Eye, FileExcel, FilePdf } from "lucide-react";
import { useState } from "react";

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState("all");
  
  const bookings = [
    {
      id: 1,
      event: "Science Exhibition",
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
      customer: "Sarah Williams",
      email: "sarah@example.com",
      phone: "0745678901",
      date: "2023-08-20",
      tickets: 2,
      total: "1500",
      status: "cancelled"
    }
  ];

  const confirmedBookings = bookings.filter(booking => booking.status === "confirmed");
  const pendingBookings = bookings.filter(booking => booking.status === "pending");
  const cancelledBookings = bookings.filter(booking => booking.status === "cancelled");

  // Get the current active bookings list based on tab
  const getCurrentBookings = () => {
    switch (activeTab) {
      case "confirmed": return confirmedBookings;
      case "pending": return pendingBookings;
      case "cancelled": return cancelledBookings;
      default: return bookings;
    }
  };

  // Handle exports
  const handleExportToExcel = () => {
    exportToExcel(getCurrentBookings());
  };

  const handleExportToPDF = () => {
    exportToPDF(getCurrentBookings());
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
              <div className="text-2xl font-bold">{bookings.length}</div>
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
                KES {bookings.reduce((sum, booking) => sum + parseInt(booking.total), 0)}
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleExportToExcel}
              >
                <FileExcel className="h-4 w-4" />
                Export to Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleExportToPDF}
              >
                <FilePdf className="h-4 w-4" />
                Export to PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderBookingTable(bookings)}
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
