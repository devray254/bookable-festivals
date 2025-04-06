
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Save, CalendarIcon, Clock, MapPin, BanknoteIcon } from "lucide-react";
import { toast } from "sonner";
import { updateEvent } from "@/utils/events";
import { fetchCategories } from "@/utils/categories";

interface Category {
  id: number;
  name: string;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  price: number | string;
  category_id: number;
  category_name?: string;
  image_url?: string;
  is_free?: boolean;
  created_by?: string;
}

interface EditEventDialogProps {
  event: Event;
  onEventUpdated: () => void;
  adminEmail: string;
}

export function EditEventDialog({ event, onEventUpdated, adminEmail }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Event>({...event});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  // Check if this is a past event
  const isPastEvent = new Date(event.date) < new Date();
  
  // Load categories for dropdown
  useEffect(() => {
    if (open) {
      const loadCategories = async () => {
        setIsLoadingCategories(true);
        try {
          const categoriesData = await fetchCategories();
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error loading categories:", error);
          toast.error("Failed to load categories");
        } finally {
          setIsLoadingCategories(false);
        }
      };
      
      loadCategories();
    }
  }, [open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "is_free") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        is_free: isChecked,
        price: isChecked ? 0 : formData.price
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await updateEvent(formData.id, {
        ...formData,
        created_by: adminEmail
      });
      
      if (result.success) {
        toast.success("Event updated successfully");
        onEventUpdated();
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("An error occurred while updating the event");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Edit Event"
          disabled={isPastEvent}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event: {event.title}</DialogTitle>
        </DialogHeader>
        
        {isPastEvent ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <p className="text-amber-800">This is a past event and cannot be edited.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                  disabled={isLoadingCategories}
                >
                  {isLoadingCategories ? (
                    <option>Loading categories...</option>
                  ) : (
                    <>
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <BanknoteIcon className="h-4 w-4" /> Price (KES)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={typeof formData.price === 'string' ? formData.price : formData.price.toString()}
                  onChange={handleChange}
                  required
                  disabled={formData.is_free === true}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_free"
                  name="is_free"
                  checked={formData.is_free === true}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_free">This is a free event</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
