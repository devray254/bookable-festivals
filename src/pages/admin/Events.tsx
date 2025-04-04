
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Upload, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: string;
  image: string;
}

export default function AdminEvents() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Science Exhibition",
      date: "2023-08-15",
      location: "Main Hall",
      category: "Science",
      price: "500"
    },
    {
      id: 2,
      title: "Tech Workshop",
      date: "2023-08-20",
      location: "Lab 2",
      category: "Technology",
      price: "750"
    },
    {
      id: 3,
      title: "Chemistry Seminar",
      date: "2023-08-25",
      location: "Lecture Room",
      category: "Science",
      price: "300"
    }
  ]);
  
  const form = useForm<EventFormData>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      price: "",
      category: "",
      image: ""
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // For demo purposes, set the image field to the file name
      form.setValue("image", file.name);
    }
  };

  const onSubmit = (data: EventFormData) => {
    console.log(data);
    console.log("Selected image:", selectedImage);
    
    // Here you would upload the image to your server and get back a URL
    // In a real implementation, you'd make an API call to upload the file
    
    // For demonstration purposes, we'll use the file name or preview URL
    const imageUrl = imagePreview || "/placeholder.svg";
    
    // In a real app, we would send this to an API
    setEvents([...events, { 
      id: events.length + 1, 
      title: data.title,
      date: data.date,
      location: data.location,
      category: data.category,
      price: data.price
    }]);
    
    toast({
      title: "Event created",
      description: `Successfully created ${data.title} with image: ${selectedImage?.name || 'none'}`
    });
    
    // Reset form and image state
    setIsDialogOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Manage your events here</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for Maabara Online. Fill in all the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter event title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter event description" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter venue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (KES)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Replace URL input with file upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Image</FormLabel>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              id="event-image"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <Label 
                              htmlFor="event-image" 
                              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {selectedImage ? "Change Image" : "Upload Image"}
                            </Label>
                            <Input 
                              {...field} 
                              className="hidden" 
                              readOnly
                            />
                          </div>
                          
                          {/* Image preview */}
                          {imagePreview && (
                            <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                              />
                              <Button 
                                type="button"
                                variant="destructive" 
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setImagePreview(null);
                                  form.setValue("image", "");
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                          
                          {!imagePreview && (
                            <div className="flex items-center justify-center w-full p-6 border border-dashed rounded-md">
                              <div className="flex flex-col items-center text-sm text-muted-foreground">
                                <Image className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p>Upload an image for your event</p>
                                <p className="text-xs">PNG, JPG or GIF up to 5MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Price (KES)</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b">
                        <td className="p-2">{event.title}</td>
                        <td className="p-2">{event.date}</td>
                        <td className="p-2">{event.location}</td>
                        <td className="p-2">{event.category}</td>
                        <td className="p-2">{event.price}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
