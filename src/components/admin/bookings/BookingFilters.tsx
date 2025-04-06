
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/utils/events";

interface BookingFiltersProps {
  events: Event[];
  selectedEventId: number | null;
  onEventSelect: (eventId: number | null) => void;
}

export function BookingFilters({
  events,
  selectedEventId,
  onEventSelect,
}: BookingFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // In a real implementation, this would trigger a search
  };

  const clearFilters = () => {
    setSearchTerm("");
    onEventSelect(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default" size="default">
            Search
          </Button>
        </form>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters {selectedEventId !== null && "(1)"}
        </Button>
      </div>

      {showFilters && (
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Filter Bookings</h3>
            {(selectedEventId !== null) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-sm"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-filter">Event</Label>
              <Select
                value={selectedEventId?.toString() || "all"}
                onValueChange={(value) =>
                  onEventSelect(value === "all" ? null : parseInt(value))
                }
              >
                <SelectTrigger id="event-filter">
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
