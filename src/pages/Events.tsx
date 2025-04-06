import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon, MapPinIcon, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { fetchEvents } from "@/utils/events";
import { fetchCategories } from "@/utils/categories";
import { checkInactivity } from "@/utils/db-connection";
import { Event } from "@/utils/events/types";

interface Category {
  id: number;
  name: string;
  description?: string;
  events_count?: number;
}

const Events = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  useEffect(() => {
    const restoreSessionState = () => {
      const savedSearch = sessionStorage.getItem('events_searchTerm');
      const savedCategory = sessionStorage.getItem('events_selectedCategory');
      const savedPriceRange = sessionStorage.getItem('events_priceRange');
      const savedShowFilters = sessionStorage.getItem('events_showFilters');
      
      if (savedSearch) setSearchTerm(savedSearch);
      if (savedCategory) setSelectedCategory(savedCategory);
      if (savedPriceRange) setPriceRange(JSON.parse(savedPriceRange));
      if (savedShowFilters) setShowFilters(savedShowFilters === 'true');
    };
    
    if (checkInactivity()) {
      console.log('User was inactive for 5+ minutes, resetting state');
      sessionStorage.removeItem('events_searchTerm');
      sessionStorage.removeItem('events_selectedCategory');
      sessionStorage.removeItem('events_priceRange');
      sessionStorage.removeItem('events_showFilters');
    } else {
      restoreSessionState();
    }
  }, []);
  
  useEffect(() => {
    sessionStorage.setItem('events_searchTerm', searchTerm);
    sessionStorage.setItem('events_selectedCategory', selectedCategory);
    sessionStorage.setItem('events_priceRange', JSON.stringify(priceRange));
    sessionStorage.setItem('events_showFilters', showFilters.toString());
  }, [searchTerm, selectedCategory, priceRange, showFilters]);
  
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
      console.log('Events loaded:', eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events. Using fallback data.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      console.log('Categories loaded:', categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };
  
  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);
  
  useEffect(() => {
    if (events.length === 0) return;
    
    let result = [...events];
    
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.category_name && event.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      result = result.filter(event => 
        (event.category_name && event.category_name === selectedCategory) ||
        event.category_id === parseInt(selectedCategory)
      );
    }
    
    result = result.filter(event => {
      const eventPrice = typeof event.price === 'string' ? parseFloat(event.price) : event.price;
      return eventPrice >= priceRange[0] && eventPrice <= priceRange[1];
    });
    
    setFilteredEvents(result);
  }, [events, searchTerm, selectedCategory, priceRange]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-eventPurple-700 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Browse Events
          </h1>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search events..."
              className="w-full py-6 pl-12 pr-4 rounded-lg text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            
            <Button 
              className="absolute right-1 top-1 text-sm flex items-center"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-8 flex-grow">
        <div className="container mx-auto px-4">
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-gray-800">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="all-categories" 
                      checked={selectedCategory === ""} 
                      onCheckedChange={() => setSelectedCategory("")} 
                    />
                    <Label htmlFor="all-categories" className="ml-2">
                      All Categories
                    </Label>
                  </div>
                  
                  {loadingCategories ? (
                    <div className="py-2 text-sm text-gray-500">Loading categories...</div>
                  ) : categories.length > 0 ? (
                    categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={selectedCategory === category.name} 
                          onCheckedChange={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)} 
                        />
                        <Label htmlFor={`category-${category.id}`} className="ml-2">
                          {category.name} {category.events_count !== undefined && `(${category.events_count})`}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-sm text-gray-500">No categories found</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-gray-800">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 5000]}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>KES {priceRange[0]}</span>
                    <span>KES {priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-gray-800">Date</h3>
                <Button variant="outline" className="w-full justify-start text-gray-700">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Select Dates
                </Button>
              </div>
            </div>
          )}
          
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredEvents.length} events
              {selectedCategory && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                loadEvents();
                loadCategories();
              }} 
              disabled={isLoading || loadingCategories}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || loadingCategories ? 'animate-spin' : ''}`} />
              {isLoading || loadingCategories ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="py-10 text-center">
              <RefreshCw className="h-10 w-10 animate-spin mx-auto mb-4 text-eventPurple-600" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  id={event.id}
                  title={event.title} 
                  image={event.image_url || '/placeholder.svg'} 
                  date={new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                  time={event.time || '00:00'} 
                  location={event.location} 
                  price={typeof event.price === 'string' ? parseFloat(event.price) : event.price} 
                  category={event.category_name || `Category ${event.category_id}`}
                  is_free={Boolean(event.is_free)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find events.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;
