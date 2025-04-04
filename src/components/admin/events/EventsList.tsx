
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  price: string;
}

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  return (
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
                {events.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="p-2 font-medium">{event.title}</td>
                    <td className="p-2">{event.date}</td>
                    <td className="p-2">{event.location}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="capitalize">{event.category}</Badge>
                    </td>
                    <td className="p-2">{event.price}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
