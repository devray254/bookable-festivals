
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { EventFormFields } from "./EventFormFields";
import { EventImageUpload } from "./EventImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the validation schema with Zod
const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.string().optional(),
});

// Infer the type from the schema
type EventFormData = z.infer<typeof eventFormSchema>;

interface AddEventDialogProps {
  onEventAdded: (event: any) => void;
  adminEmail?: string; // Make adminEmail optional
}

export function AddEventDialog({ onEventAdded, adminEmail }: AddEventDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
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
  
  const { formState } = form;
  const { errors } = formState;

  const onSubmit = async (data: EventFormData) => {
    console.log("Form submitted:", data);
    console.log("Admin email:", adminEmail); // Log the admin email
    
    try {
      // For demonstration purposes, we'll use the file name or preview URL
      const newEvent = { 
        id: Date.now(), 
        title: data.title,
        date: data.date,
        location: data.location,
        category: data.category,
        price: data.price
      };
      
      // Add event to the list
      onEventAdded(newEvent);
      
      toast({
        title: "Event created",
        description: `Successfully created ${data.title}`
      });
      
      // Reset form and dialog state
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event for Maabara Online. Fill in all the required fields below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <EventFormFields form={form} />
              <EventImageUpload form={form} />
              
              <DialogFooter className="pt-4 sticky bottom-0">
                <Button type="submit" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
