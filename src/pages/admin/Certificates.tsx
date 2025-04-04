
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificateGenerator } from "@/components/admin/certificates/CertificateGenerator";
import { CertificatesList } from "@/components/admin/certificates/CertificatesList";
import { fetchEvents } from "@/utils/events";

export default function AdminCertificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificate Management</h1>
          <p className="text-muted-foreground">Generate and manage attendance certificates</p>
        </div>
        
        <Tabs defaultValue="generate">
          <TabsList>
            <TabsTrigger value="generate">Generate Certificates</TabsTrigger>
            <TabsTrigger value="view">View Certificates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Search events..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedEvent === event.id 
                              ? 'border-eventPurple-700 bg-eventPurple-50' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedEvent(event.id)}
                        >
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {selectedEvent && (
              <CertificateGenerator eventId={selectedEvent} />
            )}
          </TabsContent>
          
          <TabsContent value="view" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Search events..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedEvent === event.id 
                              ? 'border-eventPurple-700 bg-eventPurple-50' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedEvent(event.id)}
                        >
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {selectedEvent && (
              <CertificatesList eventId={selectedEvent} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
