import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { getEventById } from "@/utils/events";
import { Event } from "@/utils/events/types";

const EventDetail = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isPastEvent, setIsPastEvent] = useState(false);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching event with ID:', eventId);
        const response = await getEventById(eventId);
        
        if (response.success && response.event) {
          console.log('Event fetched successfully:', response.event);
          setEvent(response.event);
        } else {
          console.error('Failed to fetch event:', response.message);
          toast({
            title: "Error",
            description: "Failed to load event details. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading the event.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (eventId) {
      fetchEventData();
    }
  }, [eventId, toast]);

  // Check if event date is in the past
  useEffect(() => {
    if (event) {
      try {
        // Parse the date string - support multiple formats
        let eventDate: Date | null = null;
        
        if (typeof event.date === 'string') {
          // Try parsing with default Date constructor
          const defaultDate = new Date(event.date);
          if (!isNaN(defaultDate.getTime())) {
            eventDate = defaultDate;
          } else {
            // Try parsing month name format like "Oct 15, 2023"
            const monthNames = ["January", "February", "March", "April", "May", "June", 
                              "July", "August", "September", "October", "November", "December"];
            
            // Try full month name format
            for (let i = 0; i < monthNames.length; i++) {
              if (event.date.toLowerCase().includes(monthNames[i].toLowerCase())) {
                const parts = event.date.split(/[\s,]+/);
                if (parts.length >= 3) {
                  const monthIndex = i;
                  let day = 1;
                  let year = new Date().getFullYear();
                  
                  // Find the day and year in the parts
                  for (const part of parts) {
                    const num = parseInt(part.replace(/\D/g, ''));
                    if (!isNaN(num)) {
                      if (num >= 1000) {
                        year = num;
                      } else if (num >= 1 && num <= 31) {
                        day = num;
                      }
                    }
                  }
                  
                  eventDate = new Date(year, monthIndex, day);
                  break;
                }
              }
            }
            
            // If still null, try DD/MM/YYYY or similar formats
            if (eventDate === null) {
              const dateParts = event.date.split(/[\/\-\s]+/);
              if (dateParts.length >= 3) {
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
                const year = parseInt(dateParts[2]);
                
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                  eventDate = new Date(year, month, day);
                }
              }
            }
          }
        }
        
        // If we still couldn't parse the date, use tomorrow as default
        if (eventDate === null) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          eventDate = tomorrow;
          console.log("Could not parse date, using tomorrow as default:", tomorrow);
        }
        
        // Compare dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        // Set isPastEvent based on date comparison
        const isPast = eventDate < today;
        console.log(`Event date: ${eventDate}, Today: ${today}, Is past: ${isPast}`);
        setIsPastEvent(isPast);
      } catch (error) {
        console.error("Error parsing date:", error);
        setIsPastEvent(false); // Default to not past event if parsing fails
      }
    }
  }, [event]);
  
  // Handle when event is not found or loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Event</h1>
            <p className="text-gray-600">Please wait while we fetch the event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
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
    if (isPastEvent) {
      toast({
        title: "Sorry, this event has already taken place.",
        description: "You cannot book tickets for past events.",
        variant: "destructive"
      });
      return;
    }
    
    setTicketQuantity(quantity);
    setIsBookingModalOpen(true);
  };

  // Format the event data for display
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get event price - handle different formats
  const eventPrice = typeof event.price === 'string' ? parseFloat(event.price) : event.price;
  
  // Whether event has webinar access - convert to boolean properly
  const hasWebinar = event.has_webinar === 1 || event.has_webinar === true;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Event Header Section */}
      <EventHeader 
        title={event.title}
        image={event.image_url || '/placeholder.svg'}
        category={event.category_name || `Category ${event.category_id}`}
        organizer={event.created_by || "Event Organizer"}
      />
      
      {/* Event Details Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="details" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              {hasWebinar && (
                <TabsTrigger value="webinar">Webinar Access</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <EventInfo description={event.description || ""} />
                  <EventLocation location={event.location} />
                </div>
                
                {/* Booking Card */}
                <div className="lg:col-span-1">
                  <BookingCard 
                    date={formattedDate}
                    time={event.time || "00:00"}
                    location={event.location}
                    availableTickets={100} // Default value since it's not in the Event type
                    price={eventPrice}
                    onBookNow={handleBookNow}
                  />
                </div>
              </div>
            </TabsContent>
            
            {hasWebinar && (
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
        eventPrice={eventPrice}
        eventId={event.id}
      />
      
      <Footer />
    </div>
  );
};

export default EventDetail;
