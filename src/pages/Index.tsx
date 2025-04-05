
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import { fetchCategories } from "@/utils/categories";

// Mock data for featured events
const featuredEvents = [
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
  }
];

// Define Category type
interface Category {
  id: number;
  name: string;
  events_count?: number;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
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
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-eventPurple-700 to-eventPurple-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover & Book Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-eventPurple-100">
              Find the perfect events to attend and create memories that last a lifetime
            </p>
            
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
      
      {/* Featured Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
            <Link to="/events" className="text-eventPurple-700 hover:underline font-medium">
              View All Events →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Create Events Section */}
      <section className="py-12 bg-eventPurple-50">
        <div className="container mx-auto px-4">
          <div className="rounded-xl bg-white overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Want to host your own event?
                </h2>
                <p className="text-gray-600 mb-6">
                  Create and manage your events, sell tickets and connect with attendees. Our platform makes it easy to organize successful events.
                </p>
                <div>
                  <Link to="/organizers">
                    <Button className="bg-eventPurple-700 hover:bg-eventPurple-800">
                      Become an Organizer
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                  alt="Event organizing" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
