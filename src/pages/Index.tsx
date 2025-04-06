
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import { fetchCategories } from "@/utils/categories";
import { fetchEvents } from "@/utils/events";
import { getCurrentLogo } from "@/utils/image-upload";

// Define Category type
interface Category {
  id: number;
  name: string;
  events_count?: number;
}

// Define Event type
interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  price: number;
  is_free?: number;
  category_id: number;
  category_name?: string;
  image_url?: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [logoUrl, setLogoUrl] = useState(getCurrentLogo());
  
  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        console.log('Categories loaded on homepage:', categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback to empty categories
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
    
    // Update logo URL when it changes
    const intervalId = setInterval(() => {
      const currentLogo = getCurrentLogo();
      if (currentLogo !== logoUrl) {
        setLogoUrl(currentLogo);
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [logoUrl]);

  // Load events on component mount
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

  // Filter upcoming and past events based on East Africa Time (EAT)
  const { upcomingEvents, pastEvents } = separateEventsByDate(events);

  // Function to convert date to East Africa Time and separate events
  function separateEventsByDate(allEvents: Event[]) {
    const now = new Date();
    const eatNow = convertToEAT(now);
    eatNow.setHours(0, 0, 0, 0); // Remove time component for date comparison

    const upcoming: Event[] = [];
    const past: Event[] = [];

    allEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const eatEventDate = convertToEAT(eventDate);
      eatEventDate.setHours(0, 0, 0, 0); // Remove time component for date comparison

      if (eatEventDate >= eatNow) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Sort upcoming events by date (closest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Sort past events by date (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcomingEvents: upcoming, pastEvents: past };
  }

  // Convert date to East Africa Time (EAT is UTC+3)
  function convertToEAT(date: Date) {
    const eatDate = new Date(date);
    // Get UTC time in milliseconds
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    // EAT is UTC+3
    const eatTime = utcTime + (3 * 3600000);
    eatDate.setTime(eatTime);
    return eatDate;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-eventPurple-700 to-eventPurple-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src={logoUrl} 
                alt="Maabara Online Logo" 
                className="h-28 md:h-36 object-contain" 
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
              Welcome to Maabara Online™
            </h1>
            <div className="text-xl md:text-2xl mb-10 text-eventPurple-100 max-w-2xl mx-auto leading-relaxed">
              <p className="mb-4">
                A trade mark of Maabara Hub Africa LTD, a dedicated platform for Continuing Professional Development (CPD) to healthcare providers.
              </p>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search for events, venues or categories..."
                className="w-full py-6 pl-12 pr-4 text-gray-900 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              
              <Link to={`/events?search=${searchTerm}`}>
                <Button className="absolute right-1 top-1 bg-eventPink-500 hover:bg-eventPink-600">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events" className="text-eventPurple-700 hover:underline font-medium">
              View All Events →
            </Link>
          </div>
          
          {isLoadingEvents ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard 
                  key={event.id} 
                  id={event.id}
                  title={event.title} 
                  image={event.image_url || '/placeholder.svg'} 
                  date={new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                  time={event.time || '00:00'} 
                  location={event.location} 
                  price={event.price} 
                  category={event.category_name || `Category ${event.category_id}`}
                  is_free={event.is_free === 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No upcoming events found</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Browse Events by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoadingCategories ? (
              // Loading state
              Array(6).fill(0).map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                </div>
              ))
            ) : categories.length > 0 ? (
              // Show real categories
              categories.map((category) => (
                <Link 
                  to={`/events?category=${category.name}`}
                  key={category.id}
                  className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition duration-200"
                >
                  <div className="w-12 h-12 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-eventPurple-700 font-bold">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.events_count || 0} events</p>
                </Link>
              ))
            ) : (
              // Fallback for no categories
              <div className="col-span-full text-center py-8 text-gray-500">
                No categories available
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Past Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Past Events</h2>
            <Link to="/events?past=true" className="text-eventPurple-700 hover:underline font-medium">
              View All Past Events →
            </Link>
          </div>
          
          {isLoadingEvents ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.slice(0, 3).map((event) => (
                <EventCard 
                  key={event.id} 
                  id={event.id}
                  title={event.title} 
                  image={event.image_url || '/placeholder.svg'} 
                  date={new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                  time={event.time || '00:00'} 
                  location={event.location} 
                  price={event.price} 
                  category={event.category_name || `Category ${event.category_id}`}
                  is_free={event.is_free === 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No past events found</p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
