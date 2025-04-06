
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
  // Check if the event date is in the past using current date
  const isPastEvent = () => {
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
      
      return eventDate < today;
    } catch (error) {
      console.error("Error parsing date:", error);
      return false; // Default to not past event if parsing fails
    }
  };
  
  const pastEvent = isPastEvent();
  const isFree = is_free === true || is_free === 1 || price === 0;

  // Handle potentially broken image paths
  const fallbackImage = '/placeholder.svg';
  
  // Ensure image path is valid
  let imageUrl = image;
  if (!imageUrl) {
    imageUrl = fallbackImage;
  } else if (!imageUrl.startsWith('http://') && 
             !imageUrl.startsWith('https://') && 
             !imageUrl.startsWith('/')) {
    imageUrl = `/${imageUrl}`;
  }

  // Format price as a number for display
  const formattedPrice = typeof price === 'number' ? price : parseFloat(String(price));

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
              {isFree ? "Free Event" : `KES ${formattedPrice.toLocaleString()}`}
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
