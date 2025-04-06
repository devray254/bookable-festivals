
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/utils/bookings";

interface BookingSummaryCardsProps {
  filteredBookings: Booking[];
  confirmedBookings: Booking[];
  pendingBookings: Booking[];
}

export function BookingSummaryCards({ filteredBookings, confirmedBookings, pendingBookings }: BookingSummaryCardsProps) {
  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + parseInt(booking.total), 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
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
          <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingBookings.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            KES {totalRevenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
