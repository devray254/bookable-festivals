
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, BanknoteIcon } from "lucide-react";

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

  const handleTicketDecrease = () => {
    setTicketQuantity(Math.max(1, ticketQuantity - 1));
  };

  const handleTicketIncrease = () => {
    setTicketQuantity(Math.min(10, ticketQuantity + 1));
  };

  const handleBookNow = () => {
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
      
      <Button 
        className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
        onClick={handleBookNow}
      >
        Book Now
      </Button>
    </div>
  );
};

export default BookingCard;
