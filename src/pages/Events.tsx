
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
import PageBanner from "@/components/layout/PageBanner";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <PageBanner 
        title="Browse Events" 
        subtitle="Discover upcoming CPD opportunities for healthcare professionals"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search events by title, location or category..."
              className="w-full py-6 pl-12 pr-4 rounded-lg border-blue-200 focus-visible:ring-blue-500 text-blue-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
            
            <Button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm flex items-center"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-4 text-blue-800">Categories</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="all-categories" 
                    checked={selectedCategory === ""} 
                    onCheckedChange={() => setSelectedCategory("")} 
                  />
                  <Label htmlFor="all-categories" className="ml-2 text-gray-700">
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
                      <Label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                        {category.name} {category.events_count !== undefined && <span className="text-blue-600 text-sm">({category.events_count})</span>}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="py-2 text-sm text-gray-500">No categories found</div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-blue-800">Price Range (KES)</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 5000]}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="font-medium">KES {priceRange[0].toLocaleString()}</span>
                  <span className="font-medium">KES {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-blue-800">Location</h3>
              <Button variant="outline" className="w-full justify-start text-gray-700 border-blue-200">
                <MapPinIcon className="mr-2 h-4 w-4 text-blue-600" />
                All Locations
              </Button>
              
              <h3 className="font-medium mb-4 mt-6 text-blue-800">Date</h3>
              <Button variant="outline" className="w-full justify-start text-gray-700 border-blue-200">
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                All Dates
              </Button>
            </div>
          </div>
        )}
        
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-700">
            Showing <span className="font-bold text-blue-700">{filteredEvents.length}</span> events
            {selectedCategory && <span> in <span className="font-medium text-blue-700">{selectedCategory}</span></span>}
            {searchTerm && <span> matching "<span className="font-medium text-blue-700">{searchTerm}</span>"</span>}
          </p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              loadEvents();
              loadCategories();
            }} 
            disabled={isLoading || loadingCategories}
            className="flex items-center gap-2 border-blue-200 text-blue-700"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || loadingCategories ? 'animate-spin' : ''}`} />
            {isLoading || loadingCategories ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
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
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <h3 className="text-xl font-medium text-blue-800 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find events.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;
