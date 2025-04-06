
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Edit, 
  Trash, 
  AlertCircle, 
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteEvent } from "@/utils/events";
import { EditEventDialog } from "./EditEventDialog";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category_id: number;
  category_name?: string;
  price: string | number;
  image_url?: string;
  description?: string;
}

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  onEventsChanged: () => void;
  adminEmail: string;
}

export function EventsList({ events, isLoading, onEventsChanged, adminEmail }: EventsListProps) {
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle event deletion
  const handleDelete = async () => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteEvent(eventToDelete.id, adminEmail);
      
      if (result.success) {
        toast.success(`Event "${eventToDelete.title}" deleted successfully`);
        onEventsChanged(); // Refresh the events list
      } else {
        toast.error(result.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting the event");
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>All Events</CardTitle>
          <Badge variant="outline">Loading...</Badge>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>All Events</CardTitle>
          <Badge variant="outline">{events.length} Events</Badge>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-2 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">No events found</h3>
              <p className="text-sm">Add your first event to get started</p>
            </div>
          ) : (
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
                  {events.map((event) => {
                    const isPastEvent = new Date(event.date) < new Date();
                    
                    return (
                      <tr key={event.id} className="border-b">
                        <td className="p-2 font-medium">{event.title}</td>
                        <td className="p-2">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="p-2">{event.location}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="capitalize">
                            {event.category_name || `Category ${event.category_id}`}
                          </Badge>
                        </td>
                        <td className="p-2">{typeof event.price === 'number' ? event.price.toLocaleString() : event.price}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <EditEventDialog 
                              event={event} 
                              onEventUpdated={onEventsChanged}
                              adminEmail={adminEmail}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => setEventToDelete(event)}
                              title="Delete Event"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event 
              <span className="font-semibold"> "{eventToDelete?.title}"</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
