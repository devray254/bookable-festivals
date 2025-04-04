
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";

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
  );
}
