
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MapPinIcon, Search, SlidersHorizontal } from "lucide-react";

// Mock event data
const allEvents = [
  {
    id: 1,
    title: "Tech Conference 2023",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Oct 15, 2023",
    time: "09:00 AM - 05:00 PM",
    location: "Nairobi Convention Center",
    price: 2500,
    category: "Technology"
  },
  {
    id: 2,
    title: "Music Festival",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Nov 5, 2023",
    time: "04:00 PM - 11:00 PM",
    location: "Uhuru Gardens",
    price: 1500,
    category: "Music"
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Dec 10, 2023",
    time: "11:00 AM - 07:00 PM",
    location: "Westlands Food Court",
    price: 1000,
    category: "Food & Drink"
  },
  {
    id: 4,
    title: "Art Exhibition",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Oct 22, 2023",
    time: "10:00 AM - 06:00 PM",
    location: "National Museum",
    price: 500,
    category: "Arts"
  },
  {
    id: 5,
    title: "Business Networking",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Nov 15, 2023",
    time: "06:00 PM - 09:00 PM",
    location: "Kempinski Hotel",
    price: 2000,
    category: "Business"
  },
  {
    id: 6,
    title: "Marathon 2023",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Dec 3, 2023",
    time: "06:00 AM - 12:00 PM",
    location: "City Stadium",
    price: 1000,
    category: "Sports"
  }
];

// Available categories for filtering
const categories = [
  "Music", 
  "Business", 
  "Food & Drink", 
  "Arts", 
  "Sports", 
  "Technology"
];

const Events = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  
  // Filter events based on search, category and price
  useEffect(() => {
    let result = allEvents;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(event => 
        event.category === selectedCategory
      );
    }
    
    // Filter by price range
    result = result.filter(event => 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    );
    
    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, priceRange]);
  
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
              {/* Category Filter */}
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
                  
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox 
                        id={category} 
                        checked={selectedCategory === category} 
                        onCheckedChange={() => setSelectedCategory(selectedCategory === category ? "" : category)} 
                      />
                      <Label htmlFor={category} className="ml-2">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
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
              
              {/* Date Filter - In a real app, this would use a date picker */}
              <div>
                <h3 className="font-medium mb-3 text-gray-800">Date</h3>
                <Button variant="outline" className="w-full justify-start text-gray-700">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Select Dates
                </Button>
              </div>
            </div>
          )}
          
          {/* Display filtered results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredEvents.length} events
              {selectedCategory && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} {...event} />
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
