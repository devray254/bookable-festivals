
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
  price: number | string;
  is_free?: boolean | number;
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
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="h-52 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== fallbackImage) {
              target.src = fallbackImage;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          {isFree && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white">Free</Badge>
          )}
          {pastEvent && (
            <Badge variant="secondary" className="bg-gray-600 text-white hover:bg-gray-700">Past Event</Badge>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold mb-3 text-blue-800 line-clamp-2">{title}</h3>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm">{time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm truncate">{location}</span>
          </div>
          
          <div className="flex items-center text-gray-800 font-medium">
            <BanknoteIcon className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm">
              {isFree ? "Free Event" : `KES ${formattedPrice.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 pt-0 mt-auto">
        <Link to={`/events/${id}`}>
          {pastEvent ? (
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" disabled>
              Event Completed
            </Button>
          ) : (
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
          )}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
