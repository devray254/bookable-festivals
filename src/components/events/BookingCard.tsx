
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
      const eventDate = new Date(date);
      const today = new Date();
      
      // If parsing failed, try to extract date parts manually
      if (isNaN(eventDate.getTime())) {
        const dateParts = date.split(/[\/\-\s,]+/);
        // Try different date formats
        if (dateParts.length >= 3) {
          // Handle "Month Day, Year" format
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthIndex = months.findIndex(m => dateParts[0].includes(m));
          if (monthIndex !== -1) {
            setIsPastEvent(new Date(parseInt(dateParts[2]), monthIndex, parseInt(dateParts[1])) < today);
            return;
          }
          
          // Handle numeric formats
          setIsPastEvent(new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0])) < today);
          return;
        }
      }
      
      // Remove time part for accurate date comparison
      eventDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      setIsPastEvent(eventDate < today);
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
