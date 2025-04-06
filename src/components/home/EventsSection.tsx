
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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link to={linkUrl} className="text-eventPurple-700 hover:underline font-medium">
            {linkText}
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No {title.toLowerCase()} found</p>
          </div>
        )}
      </div>
    </section>
  );
};
