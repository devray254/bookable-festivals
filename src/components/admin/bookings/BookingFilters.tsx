
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface BookingFiltersProps {
  events: any[];
  selectedEventId: number | null;
  onEventSelect: (eventId: number | null) => void;
}

export function BookingFilters({ 
  events, 
  selectedEventId,
  onEventSelect
}: BookingFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleEventChange = (value: string) => {
    onEventSelect(value === "" ? null : parseInt(value));
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    onEventSelect(null);
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Input
          placeholder="Search bookings..."
          className="bg-white border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="ghost" size="icon" className="shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <Select
        value={selectedEventId ? String(selectedEventId) : ""}
        onValueChange={handleEventChange}
      >
        <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-300">
          <SelectValue placeholder="Filter by event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Events</SelectItem>
          {events.map((event) => (
            <SelectItem key={event.id} value={String(event.id)}>
              {event.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {(searchTerm || selectedEventId) && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-gray-500"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
