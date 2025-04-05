
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Calendar, Check, Download, KeyRound, LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/events/EventCard";
import { Navbar } from "@/components/layout/Navbar";
import { resetUserPassword } from "@/utils/database";

// Define types for user bookings
interface Booking {
  id: number;
  event: string;
  event_id: number;
  date: string;
  tickets: number;
  total: string;
  status: string;
  event_image?: string;
  certificate_id?: string;
}

// Define password change form schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Fetch user's bookings, upcoming events, past events
      fetchUserData(userData.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async (userId: number) => {
    setIsLoading(true);
    try {
      // Simulate fetching user bookings from API
      // In a real app, you would fetch from your backend
      const mockBookings: Booking[] = [
        {
          id: 1,
          event: "Science Exhibition",
          event_id: 1,
          date: "2023-08-15",
          tickets: 2,
          total: "1000",
          status: "confirmed",
          event_image: "/placeholder.svg",
          certificate_id: "cert-123"
        },
        {
          id: 2,
          event: "Tech Workshop",
          event_id: 2,
          date: "2023-08-20",
          tickets: 1,
          total: "750",
          status: "confirmed",
          event_image: "/placeholder.svg"
        }
      ];
      
      setBookings(mockBookings);
      
      // Simulate upcoming and past events
      // In production, this would come from your API
      const today = new Date();
      
      // Mock upcoming events
      setUpcomingEvents([
        {
          id: 3,
          title: "AI Conference",
          date: "2025-05-20",
          time: "09:00 AM - 05:00 PM",
          location: "Nairobi Tech Hub",
          price: 1500,
          image: "/placeholder.svg",
          category: "Technology"
        },
        {
          id: 4,
          title: "Data Science Workshop",
          date: "2025-06-15",
          time: "10:00 AM - 04:00 PM",
          location: "Virtual Event",
          price: 500,
          image: "/placeholder.svg",
          category: "Science"
        }
      ]);
      
      // Mock past events
      setPastEvents([
        {
          id: 1,
          title: "Science Exhibition",
          date: "2023-08-15",
          time: "10:00 AM - 06:00 PM",
          location: "Nairobi National Museum",
          price: 500,
          image: "/placeholder.svg",
          category: "Science"
        },
        {
          id: 2,
          title: "Tech Workshop",
          date: "2023-08-20",
          time: "09:00 AM - 03:00 PM",
          location: "iHub Nairobi",
          price: 750,
          image: "/placeholder.svg",
          category: "Technology"
        }
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data: z.infer<typeof passwordChangeSchema>) => {
    setIsUpdatingPassword(true);
    try {
      // In a real app, this would call your API to update the password
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // When integrating with the real API:
      // const result = await resetUserPassword(user.id, data.currentPassword, data.newPassword);
      // if (result.success) {
      //   toast.success("Password updated successfully");
      //   form.reset();
      // } else {
      //   toast.error(result.message || "Failed to update password");
      // }
      
      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const handleDownloadCertificate = (certificateId: string, eventName: string) => {
    // In a real app, this would download the certificate
    // For now, we'll just show a toast
    toast.success(`Downloading certificate for ${eventName}`);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null; // Will redirect to login due to the useEffect

  return (
    <>
      <Navbar />
      <div className="container max-w-6xl my-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
                <CardTitle className="text-center">{user.name}</CardTitle>
                <CardDescription className="text-center">{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Role:</span>
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Member Since:</span>
                    <span>April 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Events Attended:</span>
                    <span>{pastEvents.length}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="bookings">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              {/* Bookings Tab */}
              <TabsContent value="bookings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>
                      View all your event bookings and download certificates for past events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No bookings yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't booked any events yet. Explore our events and make your first booking!
                        </p>
                        <Button className="mt-4" onClick={() => navigate('/events')}>
                          Browse Events
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <Card key={booking.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-1/4">
                                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                      src={booking.event_image || "/placeholder.svg"} 
                                      alt={booking.event} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-3/4">
                                  <div className="flex flex-col h-full justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg">{booking.event}</h3>
                                      <p className="text-sm text-gray-500">
                                        {new Date(booking.date).toLocaleDateString()} • {booking.tickets} {booking.tickets > 1 ? 'tickets' : 'ticket'}
                                      </p>
                                      <p className="text-sm font-medium mt-1">
                                        KES {booking.total}
                                      </p>
                                      <Badge className="mt-2" variant={
                                        booking.status === 'confirmed' ? 'default' : 
                                        booking.status === 'pending' ? 'outline' : 'secondary'
                                      }>
                                        {booking.status}
                                      </Badge>
                                    </div>
                                    <div className="flex mt-2 gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigate(`/events/${booking.event_id}`)}
                                      >
                                        View Event
                                      </Button>
                                      
                                      {/* Show certificate download button for past events with certificates */}
                                      {booking.certificate_id && new Date(booking.date) < new Date() && (
                                        <Button 
                                          variant="secondary" 
                                          size="sm"
                                          onClick={() => handleDownloadCertificate(booking.certificate_id!, booking.event)}
                                        >
                                          <Download className="mr-1 h-4 w-4" />
                                          Certificate
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Upcoming Events Tab */}
              <TabsContent value="upcoming" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Explore upcoming events that might interest you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          id={event.id}
                          title={event.title}
                          image={event.image}
                          date={new Date(event.date).toLocaleDateString()}
                          time={event.time}
                          location={event.location}
                          price={event.price}
                          category={event.category}
                        />
                      ))}
                    </div>
                    
                    {upcomingEvents.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No upcoming events</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          There are no upcoming events at the moment. Check back later!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Past Events Tab */}
              <TabsContent value="past" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Past Events</CardTitle>
                    <CardDescription>
                      Events you have attended or that have already taken place
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pastEvents.map((event) => (
                        <div key={event.id} className="relative">
                          <EventCard
                            id={event.id}
                            title={event.title}
                            image={event.image}
                            date={new Date(event.date).toLocaleDateString()}
                            time={event.time}
                            location={event.location}
                            price={event.price}
                            category={event.category}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                            <Badge className="text-lg py-2 px-4">Event Completed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {pastEvents.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No past events</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't attended any events yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Settings Tab */}
              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and change your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <Separator className="my-4" />
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your current password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter new password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm your new password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button type="submit" disabled={isUpdatingPassword}>
                              {isUpdatingPassword ? (
                                <>Updating...</>
                              ) : (
                                <>
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Change Password
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-gray-500">Receive updates about events, certificates, and bookings</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Check className="mr-2 h-4 w-4" /> Enabled
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">SMS Notifications</h4>
                              <p className="text-sm text-gray-500">Receive booking confirmations and reminders via SMS</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Enable
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Account Information</h3>
                        <Separator className="my-4" />
                        <p className="text-sm text-gray-600">
                          For any changes to your profile information, please contact support.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
