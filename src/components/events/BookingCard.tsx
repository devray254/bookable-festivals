
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, BanknoteIcon, AlertTriangleIcon } from "lucide-react";
import { toast } from "sonner";

interface BookingCardProps {
  date: string;
  time: string;
  location: string;
  availableTickets: number;
  price: number;
  onBookNow: (quantity: number) => void;
}

const BookingCard = ({ 
  date, 
  time, 
  location, 
  availableTickets, 
  price, 
  onBookNow 
}: BookingCardProps) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isPastEvent, setIsPastEvent] = useState(false);

  useEffect(() => {
    // Check if the event date is in the past
    const checkEventDate = () => {
      try {
        // Parse the date string - support multiple formats
        let eventDate: Date;
        
        if (typeof date === 'string') {
          // Try standard format first
          eventDate = new Date(date);
          
          // If date is invalid, try other formats
          if (isNaN(eventDate.getTime())) {
            // Try DD/MM/YYYY
            const dateParts = date.split(/[\/\-\s,]+/);
            if (dateParts.length >= 3) {
              // Check if it's "Month Day, Year" format
              const months = ["January", "February", "March", "April", "May", "June", 
                             "July", "August", "September", "October", "November", "December"];
              const monthIndex = months.findIndex(m => 
                dateParts[0].toLowerCase().includes(m.toLowerCase()));
              
              if (monthIndex !== -1) {
                // It's in "Month Day, Year" format
                const day = parseInt(dateParts[1].replace(',', ''));
                const year = parseInt(dateParts[2]);
                eventDate = new Date(year, monthIndex, day);
              } else {
                // Assume DD/MM/YYYY or similar
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
                const year = parseInt(dateParts[2]);
                eventDate = new Date(year, month, day);
              }
            }
          }
        } else {
          // If it's not a string, use current date (fallback)
          eventDate = new Date();
        }
        
        // Get current date without time for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        setIsPastEvent(eventDate < today);
      } catch (error) {
        console.error("Error parsing date:", error);
        setIsPastEvent(false); // Default to not past event if parsing fails
      }
    };
    
    checkEventDate();
  }, [date]);

  const handleTicketDecrease = () => {
    setTicketQuantity(Math.max(1, ticketQuantity - 1));
  };

  const handleTicketIncrease = () => {
    setTicketQuantity(Math.min(10, ticketQuantity + 1));
  };

  const handleBookNow = () => {
    if (isPastEvent) {
      toast.error("Sorry, this event has already taken place. You cannot book tickets for past events.");
      return;
    }
    onBookNow(ticketQuantity);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <div className="mb-6 space-y-3">
        <div className="flex items-center text-gray-700">
          <CalendarIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <ClockIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <MapPinIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <UserIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
          <span>{availableTickets} tickets available</span>
        </div>
        
        <div className="flex items-center text-gray-900 font-medium text-lg">
          <BanknoteIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
          <span>KES {price.toLocaleString()}</span>
        </div>
      </div>
      
      {isPastEvent ? (
        <div className="mb-6 p-3 bg-gray-100 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600">
              This event has already taken place. Booking is not available for past events.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Ticket Quantity</label>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTicketDecrease}
              disabled={ticketQuantity <= 1}
            >
              -
            </Button>
            <span className="mx-4 w-8 text-center">{ticketQuantity}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTicketIncrease}
              disabled={ticketQuantity >= 10}
            >
              +
            </Button>
          </div>
        </div>
      )}
      
      <Button 
        className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
        onClick={handleBookNow}
        disabled={isPastEvent}
      >
        {isPastEvent ? "Event Completed" : "Book Now"}
      </Button>
    </div>
  );
};

export default BookingCard;
