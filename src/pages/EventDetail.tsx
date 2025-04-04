import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventHeader from "@/components/events/EventHeader";
import EventInfo from "@/components/events/EventInfo";
import EventLocation from "@/components/events/EventLocation";
import BookingCard from "@/components/events/BookingCard";
import BookingDialog from "@/components/events/BookingDialog";
import { WebinarAccessCard } from "@/components/events/WebinarAccessCard";

// Mock event data (in a real app, we would fetch this from the backend)
const eventsData = [
  {
    id: 1,
    title: "Tech Conference 2023",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Oct 15, 2023",
    time: "09:00 AM - 05:00 PM",
    location: "Nairobi Convention Center",
    price: 2500,
    category: "Technology",
    description: "Join us for the biggest tech conference in East Africa. Network with industry leaders, attend workshops, and learn about the latest innovations in technology. This year's theme is 'The Future of AI and Machine Learning'.",
    organizer: "Tech Association of Kenya",
    availableTickets: 150,
    hasWebinar: true
  },
  {
    id: 2,
    title: "Music Festival",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Nov 5, 2023",
    time: "04:00 PM - 11:00 PM",
    location: "Uhuru Gardens",
    price: 1500,
    category: "Music",
    description: "Experience an unforgettable night of music under the stars. Featuring performances from top local and international artists across various genres. Food stalls and refreshments will be available.",
    organizer: "Beat Productions",
    availableTickets: 500,
    hasWebinar: false
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Dec 10, 2023",
    time: "11:00 AM - 07:00 PM",
    location: "Westlands Food Court",
    price: 1000,
    category: "Food & Drink",
    description: "A celebration of culinary excellence featuring the finest wines and dishes from around the world. Meet celebrity chefs, participate in cooking demonstrations, and sample exquisite food and wine pairings.",
    organizer: "Taste Kenya",
    availableTickets: 200
  },
  {
    id: 4,
    title: "Art Exhibition",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Oct 22, 2023",
    time: "10:00 AM - 06:00 PM",
    location: "National Museum",
    price: 500,
    category: "Arts",
    description: "Explore a stunning collection of contemporary and traditional African art. This exhibition showcases works from emerging and established artists, highlighting the rich cultural heritage and modern expressions of African art.",
    organizer: "Arts Foundation",
    availableTickets: 300
  },
  {
    id: 5,
    title: "Business Networking",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Nov 15, 2023",
    time: "06:00 PM - 09:00 PM",
    location: "Kempinski Hotel",
    price: 2000,
    category: "Business",
    description: "An exclusive networking event for entrepreneurs, executives, and professionals. Make valuable connections, share insights, and explore business opportunities. Includes a keynote speech on sustainable business practices.",
    organizer: "Business Hub",
    availableTickets: 100
  },
  {
    id: 6,
    title: "Marathon 2023",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    date: "Dec 3, 2023",
    time: "06:00 AM - 12:00 PM",
    location: "City Stadium",
    price: 1000,
    category: "Sports",
    description: "The annual city marathon returns for its 10th edition. Choose between 5K, 10K, half-marathon, and full marathon distances. The event supports local education initiatives with a portion of each registration going to charity.",
    organizer: "Run Kenya",
    availableTickets: 2000
  }
];

const EventDetail = () => {
  const { id } = useParams();
  const eventId = Number(id);
  
  // Find the event by ID
  const event = eventsData.find(e => e.id === eventId);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  
  // Handle when event is not found
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events">
              <Button>Browse Other Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleBookNow = (quantity: number) => {
    setTicketQuantity(quantity);
    setIsBookingModalOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Event Header Section */}
      <EventHeader 
        title={event.title}
        image={event.image}
        category={event.category}
        organizer={event.organizer}
      />
      
      {/* Event Details Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="details" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              {event.hasWebinar && (
                <TabsTrigger value="webinar">Webinar Access</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <EventInfo description={event.description} />
                  <EventLocation location={event.location} />
                </div>
                
                {/* Booking Card */}
                <div className="lg:col-span-1">
                  <BookingCard 
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    availableTickets={event.availableTickets}
                    price={event.price}
                    onBookNow={handleBookNow}
                  />
                </div>
              </div>
            </TabsContent>
            
            {event.hasWebinar && (
              <TabsContent value="webinar">
                <div className="max-w-md mx-auto">
                  <WebinarAccessCard 
                    eventId={event.id} 
                    eventTitle={event.title} 
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Booking Dialog */}
      <BookingDialog 
        isOpen={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        ticketQuantity={ticketQuantity}
        eventTitle={event.title}
        eventPrice={event.price}
      />
      
      <Footer />
    </div>
  );
};

export default EventDetail;
