
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/utils/bookings";
import { BookingTable } from "./BookingTable";
import { Badge } from "@/components/ui/badge";

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
      <TabsList className="mb-4 bg-white">
        <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
          All <Badge variant="outline" className="ml-1 bg-white text-primary">{filteredBookings.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="confirmed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
          Confirmed <Badge variant="outline" className="ml-1 bg-white text-primary">{confirmedBookings.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
          Pending <Badge variant="outline" className="ml-1 bg-white text-primary">{pendingBookings.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="data-[state=active]:bg-primary data-[state=active]:text-white">
          Cancelled <Badge variant="outline" className="ml-1 bg-white text-primary">{cancelledBookings.length}</Badge>
        </TabsTrigger>
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
