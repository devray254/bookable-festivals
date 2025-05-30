
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCategories } from "@/utils/categories";
import { fetchEvents } from "@/utils/events";
import { Event } from "@/utils/events/types";
import { Hero } from "@/components/home/Hero";
import { EventsSection } from "@/components/home/EventsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { separateEventsByDate } from "@/utils/date-helpers";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  events_count?: number;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        console.log('Categories loaded on homepage:', categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Could not load categories. Please try again later.");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        console.log('Events loaded on homepage:', eventsData);
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Could not load events. Please try again later.");
        setEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    loadEvents();
  }, []);

  const { upcomingEvents, pastEvents } = separateEventsByDate(events);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <Hero />
      
      <div className="bg-gradient-to-br from-white to-purple-50">
        <EventsSection 
          title="Upcoming Events"
          events={upcomingEvents}
          isLoading={isLoadingEvents}
          linkText="View All Events →"
          linkUrl="/events"
        />
      </div>
      
      <CategoriesSection 
        categories={categories}
        isLoading={isLoadingCategories}
      />
      
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <EventsSection 
          title="Past Events"
          events={pastEvents}
          isLoading={isLoadingEvents}
          linkText="View All Past Events →"
          linkUrl="/events?past=true"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
