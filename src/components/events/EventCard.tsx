
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
      
      // If we still couldn't parse the date, use tomorrow as default
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

  // Log the ID to help with debugging
  console.log(`Rendering EventCard for event ID: ${id}`);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 flex flex-col h-full transform hover:-translate-y-1">
      <Link to={`/events/${id}`} className="h-52 overflow-hidden relative">
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
      </Link>
      
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold mb-3 text-blue-800 line-clamp-2">
          <Link to={`/events/${id}`} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>
        
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
            <Button className="w-full">
              Book Now
            </Button>
          )}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
