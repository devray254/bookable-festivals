
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Booking } from "@/utils/bookings";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookingTableProps {
  bookings: Booking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-white">
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
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500">No bookings found</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{booking.event}</td>
                <td className="p-2">{booking.customer}</td>
                <td className="p-2">{booking.email}</td>
                <td className="p-2">{booking.phone}</td>
                <td className="p-2">{booking.date}</td>
                <td className="p-2">{booking.tickets}</td>
                <td className="p-2">{parseInt(booking.total).toLocaleString()}</td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(booking.status)}
                    <Badge variant={
                      booking.status === "confirmed" ? "default" : 
                      booking.status === "pending" ? "secondary" : "destructive"
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                </td>
                <td className="p-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View booking details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
