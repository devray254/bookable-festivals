
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCategories } from "@/utils/categories";
import { fetchEvents } from "@/utils/events";
import { getCurrentLogo } from "@/utils/image-upload";
import { Event } from "@/utils/events/types";
import { Hero } from "@/components/home/Hero";
import { EventsSection } from "@/components/home/EventsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { separateEventsByDate } from "@/utils/date-helpers";

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
  const [logoUrl, setLogoUrl] = useState(getCurrentLogo());
  
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        console.log('Categories loaded on homepage:', categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
    
    const intervalId = setInterval(() => {
      const currentLogo = getCurrentLogo();
      if (currentLogo !== logoUrl) {
        setLogoUrl(currentLogo);
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [logoUrl]);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        console.log('Events loaded on homepage:', eventsData);
      } catch (error) {
        console.error("Error loading events:", error);
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
      
      <Hero logoUrl={logoUrl} />
      
      <EventsSection 
        title="Upcoming Events"
        events={upcomingEvents}
        isLoading={isLoadingEvents}
        linkText="View All Events →"
        linkUrl="/events"
      />
      
      <CategoriesSection 
        categories={categories}
        isLoading={isLoadingCategories}
      />
      
      <EventsSection 
        title="Past Events"
        events={pastEvents}
        isLoading={isLoadingEvents}
        linkText="View All Past Events →"
        linkUrl="/events?past=true"
      />
      
      <Footer />
    </div>
  );
};

export default Index;
