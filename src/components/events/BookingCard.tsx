
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
        let eventDate: Date | null = null;
        
        if (typeof date === 'string') {
          // Try parsing with default Date constructor
          const defaultDate = new Date(date);
          if (!isNaN(defaultDate.getTime())) {
            eventDate = defaultDate;
          } else {
            // Try parsing month name format like "Oct 15, 2023"
            const monthNames = ["January", "February", "March", "April", "May", "June", 
                               "July", "August", "September", "October", "November", "December"];
            
            // Try full month name format
            for (let i = 0; i < monthNames.length; i++) {
              if (date.toLowerCase().includes(monthNames[i].toLowerCase())) {
                const parts = date.split(/[\s,]+/);
                if (parts.length >= 3) {
                  const monthIndex = i;
                  let day = 1;
                  let year = new Date().getFullYear();
                  
                  // Find the day and year in the parts
                  for (const part of parts) {
                    const num = parseInt(part.replace(/\D/g, ''));
                    if (!isNaN(num)) {
                      if (num >= 1000) {
                        year = num;
                      } else if (num >= 1 && num <= 31) {
                        day = num;
                      }
                    }
                  }
                  
                  eventDate = new Date(year, monthIndex, day);
                  break;
                }
              }
            }
            
            // If still null, try DD/MM/YYYY or similar formats
            if (eventDate === null) {
              const dateParts = date.split(/[\/\-\s]+/);
              if (dateParts.length >= 3) {
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
                const year = parseInt(dateParts[2]);
                
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                  eventDate = new Date(year, month, day);
                }
              }
            }
          }
        }
        
        // If we still couldn't parse the date, use tomorrow as default (to ensure booking works)
        if (eventDate === null) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          eventDate = tomorrow;
          console.log("Could not parse date, using tomorrow as default:", tomorrow);
        }
        
        // Compare dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        const isPast = eventDate < today;
        console.log(`BookingCard - Event date: ${eventDate}, Today: ${today}, Is past: ${isPast}`);
        setIsPastEvent(isPast);
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
          <CalendarIcon className="h-5 w-5 mr-3 text-blue-600" />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <ClockIcon className="h-5 w-5 mr-3 text-blue-600" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <MapPinIcon className="h-5 w-5 mr-3 text-blue-600" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <UserIcon className="h-5 w-5 mr-3 text-blue-600" />
          <span>{availableTickets} tickets available</span>
        </div>
        
        <div className="flex items-center text-gray-900 font-medium text-lg">
          <BanknoteIcon className="h-5 w-5 mr-3 text-blue-600" />
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
        className="w-full"
        onClick={handleBookNow}
        disabled={isPastEvent}
      >
        {isPastEvent ? "Event Completed" : "Book Now"}
      </Button>
    </div>
  );
};

export default BookingCard;
