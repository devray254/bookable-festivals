
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
  // Check if the event date is in the past using East Africa Time (EAT)
  const isPastEvent = () => {
    // Parse the date string
    const eventDate = new Date(date);
    
    // If parsing failed, try to extract date parts manually
    if (isNaN(eventDate.getTime())) {
      const dateParts = date.split(/[\/\-\s,]+/);
      // Try different date formats
      if (dateParts.length >= 3) {
        // Handle "Month Day, Year" format
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = months.findIndex(m => dateParts[0].includes(m));
        if (monthIndex !== -1) {
          return convertToEAT(new Date(parseInt(dateParts[2]), monthIndex, parseInt(dateParts[1]))) < convertToEAT(new Date());
        }
        
        // Handle numeric formats
        return convertToEAT(new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]))) < convertToEAT(new Date());
      }
    }
    
    // Convert to East Africa Time for comparison
    const eatEventDate = convertToEAT(eventDate);
    const eatToday = convertToEAT(new Date());
    
    // Remove time part for accurate date comparison
    eatEventDate.setHours(0, 0, 0, 0);
    eatToday.setHours(0, 0, 0, 0);
    
    return eatEventDate < eatToday;
  };
  
  // Convert date to East Africa Time (EAT is UTC+3)
  const convertToEAT = (date: Date) => {
    const eatDate = new Date(date);
    // Get UTC time in milliseconds
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    // EAT is UTC+3
    const eatTime = utcTime + (3 * 3600000);
    eatDate.setTime(eatTime);
    return eatDate;
  };
  
  const pastEvent = isPastEvent();
  const isFree = is_free === true || price === 0;

  // Handle potentially broken image paths
  const fallbackImage = '/placeholder.svg';
  const imageUrl = image || fallbackImage;

  return (
    <div className="event-card bg-white rounded-lg overflow-hidden shadow border border-gray-100">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== fallbackImage) {
              target.src = fallbackImage;
            }
          }}
        />
        {isFree && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
          </div>
        )}
        {pastEvent && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-gray-500 hover:bg-gray-600">Past Event</Badge>
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
