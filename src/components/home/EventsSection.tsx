
import { Link } from "react-router-dom";
import EventCard from "@/components/events/EventCard";
import { Event } from "@/utils/events/types";

interface EventsSectionProps {
  title: string;
  events: Event[];
  isLoading: boolean;
  linkText: string;
  linkUrl: string;
}

export const EventsSection = ({ 
  title, 
  events, 
  isLoading, 
  linkText, 
  linkUrl 
}: EventsSectionProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <Link to={linkUrl} className="text-blue-600 hover:text-red-600 hover:underline font-medium flex items-center transition-colors">
            {linkText}
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <EventCard 
                key={event.id} 
                id={event.id}
                title={event.title} 
                image={event.image_url || '/placeholder.svg'} 
                date={new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                time={event.time || '00:00'} 
                location={event.location} 
                price={typeof event.price === 'string' ? parseFloat(event.price as string) : event.price as number} 
                category={event.category_name || `Category ${event.category_id}`}
                is_free={Boolean(event.is_free)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-600">No {title.toLowerCase()} found</p>
          </div>
        )}
      </div>
    </section>
  );
};
