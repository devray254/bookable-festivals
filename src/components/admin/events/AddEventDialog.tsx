
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
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { EventFormFields } from "./EventFormFields";
import { EventImageUpload } from "./EventImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createEvent } from "@/utils/events";
import { CreateEventData } from "@/utils/events/types";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the validation schema with Zod
const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  priceType: z.enum(["free", "paid"]),
  price: z.union([
    z.string().optional(),
    z.number().optional()
  ]).optional().refine(val => {
    // Price is required only if priceType is 'paid'
    if (val === undefined || val === "") {
      return true; // Will be validated by the custom validation below
    }
    const numVal = Number(val);
    return !isNaN(numVal) && numVal >= 0;
  }, { message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.string().optional(),
}).refine(data => {
  // Custom validation for price based on priceType
  if (data.priceType === "paid") {
    return data.price !== undefined && data.price !== "";
  }
  return true;
}, {
  message: "Price is required for paid events",
  path: ["price"]
});

// Infer the type from the schema
type EventFormData = z.infer<typeof eventFormSchema>;

interface AddEventDialogProps {
  onEventAdded: (event: any) => void;
  adminEmail?: string;
}

export function AddEventDialog({ onEventAdded, adminEmail = 'admin@maabara.co.ke' }: AddEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      priceType: "paid",
      price: "",
      category: "",
      image: ""
    }
  });
  
  const { formState } = form;
  const { errors } = formState;

  const onSubmit = async (data: EventFormData) => {
    console.log("Form submitted:", data);
    console.log("Admin email:", adminEmail);
    
    setIsSubmitting(true);
    
    try {
      // Create full date with time
      const dateTime = new Date(`${data.date}T${data.time}`);
      
      // Set price to 0 if it's a free event
      const price = data.priceType === "free" ? 0 : data.price;
      
      // Format event data for the API
      const eventData: CreateEventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        priceType: data.priceType,
        category_id: parseInt(data.category),
        price: price,
        image_url: data.image || '/placeholder.svg',
        created_by: adminEmail
      };
      
      // Send to server
      const result = await createEvent(eventData, adminEmail);
      
      if (result.success) {
        toast.success(`Successfully created ${data.title}`);
        
        // Add event to the list with the new ID
        onEventAdded({
          id: result.id,
          ...eventData,
          is_free: data.priceType === "free" ? 1 : 0
        });
        
        // Reset form and dialog state
        setIsOpen(false);
        form.reset();
      } else {
        toast.error(result.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const EventForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EventFormFields form={form} />
        <EventImageUpload form={form} />
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4 max-h-[95vh]">
          <DrawerHeader>
            <DrawerTitle>Add New Event</DrawerTitle>
            <DrawerDescription>
              Create a new event for Maabara Online. Fill in all the required fields below.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="max-h-[calc(95vh-250px)] px-4">
            <EventForm />
          </ScrollArea>
          <DrawerFooter className="pt-2">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
            <DrawerClose asChild>
              <Button 
                variant="outline" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event for Maabara Online. Fill in all the required fields below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <EventForm />
        </ScrollArea>
        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
