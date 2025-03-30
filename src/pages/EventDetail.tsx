
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  BanknotesIcon,
  Share2Icon,
  HeartIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

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
    availableTickets: 150
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
    availableTickets: 500
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
  
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  
  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };
  
  const handlePayment = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call to M-Pesa
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully initiated M-Pesa payment request to ${phoneNumber}. You'll receive a prompt on your phone to complete the payment.`);
      setIsBookingModalOpen(false);
    }, 2000);
  };
  
  const totalAmount = event.price * ticketQuantity;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Event Header Section */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="text-white">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-eventPurple-700 rounded-full">
                {event.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-lg text-gray-200">Organized by {event.organizer}</p>
          </div>
        </div>
      </div>
      
      {/* Event Details Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-700 mb-8 whitespace-pre-line">
                  {event.description}
                </p>
                
                <div className="flex space-x-4">
                  <Button variant="outline" className="text-gray-700">
                    <Share2Icon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="text-gray-700">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              {/* Location Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Location</h2>
                <p className="text-gray-700 mb-4">{event.location}</p>
                
                {/* In a real app, this would be an actual map */}
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="mb-6 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <ClockIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <MapPinIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <UserIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
                    <span>{event.availableTickets} tickets available</span>
                  </div>
                  
                  <div className="flex items-center text-gray-900 font-medium text-lg">
                    <BanknotesIcon className="h-5 w-5 mr-3 text-eventPurple-700" />
                    <span>KES {event.price.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Ticket Quantity</label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                    >
                      -
                    </Button>
                    <span className="mx-4 w-8 text-center">{ticketQuantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                      disabled={ticketQuantity >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              You're booking {ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''} for {event.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right text-sm font-medium col-span-1">
                M-Pesa Number
              </label>
              <Input
                id="phone"
                placeholder="07XXXXXXXX"
                className="col-span-3"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ticket Price</span>
                <span>KES {event.price.toLocaleString()} x {ticketQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing Fee</span>
                <span>KES 50</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>KES {(totalAmount + 50).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-eventPurple-700 hover:bg-eventPurple-800"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay with M-Pesa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default EventDetail;
