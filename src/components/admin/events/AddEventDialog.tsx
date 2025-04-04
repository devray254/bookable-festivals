
import { useState } from "react";
import { useForm } from "react-hook-form";
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

interface AddEventDialogProps {
  onEventAdded: (event: any) => void;
}

export function AddEventDialog({ onEventAdded }: AddEventDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
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

  const onSubmit = (data: EventFormData) => {
    console.log(data);
    
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
  };

  return (
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
            <EventFormFields form={form} />
            <EventImageUpload form={form} />
            
            <DialogFooter>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
