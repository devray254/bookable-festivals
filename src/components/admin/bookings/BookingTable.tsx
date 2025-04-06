
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Booking } from "@/utils/bookings";

interface BookingTableProps {
  bookings: Booking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  return (
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
          {bookings.map((booking) => (
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
}
