
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, ClockIcon, BanknoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface EventCardProps {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
  is_free?: boolean;
  category: string;
}

const EventCard = ({ id, title, image, date, time, location, price, is_free, category }: EventCardProps) => {
  // Check if the event date is in the past
  const isPastEvent = () => {
    // Parse the date string and compare with current date
    const eventDate = new Date(date);
    const today = new Date();
    
    // Remove time part for accurate date comparison
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return eventDate < today;
  };
  
  const pastEvent = isPastEvent();
  const isFree = is_free === true || price === 0;

  return (
    <div className="event-card bg-white rounded-lg overflow-hidden shadow border border-gray-100">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        {isFree && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="mb-3 flex gap-2 flex-wrap">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-eventPurple-100 text-eventPurple-700 rounded-full">
            {category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">{location}</span>
          </div>
          
          <div className="flex items-center text-gray-800 font-medium">
            <BanknoteIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {isFree ? "Free Event" : `KES ${price.toLocaleString()}`}
            </span>
          </div>
        </div>
        
        <Link to={`/events/${id}`}>
          {pastEvent ? (
            <Button variant="secondary" className="w-full opacity-75 cursor-not-allowed" disabled>
              Event Completed
            </Button>
          ) : (
            <Button className="w-full bg-eventPurple-700 hover:bg-eventPurple-800">
              Book Now
            </Button>
          )}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
