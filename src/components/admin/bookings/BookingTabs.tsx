
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/utils/bookings";
import { BookingTable } from "./BookingTable";

interface BookingTabsProps {
  filteredBookings: Booking[];
  confirmedBookings: Booking[];
  pendingBookings: Booking[];
  cancelledBookings: Booking[];
  onTabChange: (value: string) => void;
}

export function BookingTabs({ 
  filteredBookings, 
  confirmedBookings, 
  pendingBookings, 
  cancelledBookings,
  onTabChange
}: BookingTabsProps) {
  return (
    <Tabs defaultValue="all" onValueChange={onTabChange} className="mt-4">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <BookingTable bookings={filteredBookings} />
      </TabsContent>
      
      <TabsContent value="confirmed">
        <BookingTable bookings={confirmedBookings} />
      </TabsContent>
      
      <TabsContent value="pending">
        <BookingTable bookings={pendingBookings} />
      </TabsContent>
      
      <TabsContent value="cancelled">
        <BookingTable bookings={cancelledBookings} />
      </TabsContent>
    </Tabs>
  );
}
