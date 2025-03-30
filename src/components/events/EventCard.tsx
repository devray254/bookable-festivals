
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, ClockIcon, BanknotesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EventCardProps {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: string;
}

const EventCard = ({ id, title, image, date, time, location, price, category }: EventCardProps) => {
  return (
    <div className="event-card bg-white rounded-lg overflow-hidden shadow border border-gray-100">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="p-5">
        <div className="mb-3">
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
            <BanknotesIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {price === 0 ? "Free" : `KES ${price.toLocaleString()}`}
            </span>
          </div>
        </div>
        
        <Link to={`/events/${id}`}>
          <Button className="w-full bg-eventPurple-700 hover:bg-eventPurple-800">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
