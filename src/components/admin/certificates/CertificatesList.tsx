
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Loader2 } from "lucide-react";
import { fetchCertificatesByEvent } from "@/utils/certificates";

interface CertificatesListProps {
  eventId: number;
}

export function CertificatesList({ eventId }: CertificatesListProps) {
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates', eventId],
    queryFn: () => fetchCertificatesByEvent(eventId)
  });

  const handleDownload = (certificateId: string) => {
    // In a real app, this would generate and download a PDF certificate
    console.log("Downloading certificate:", certificateId);
    alert(`In a production environment, this would download certificate ${certificateId}`);
  };

  const handleSendEmail = (certificateId: string, email: string) => {
    // In a real app, this would send an email with the certificate
    console.log("Sending certificate to:", email);
    alert(`In a production environment, this would email certificate ${certificateId} to ${email}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issued Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-eventPurple-700" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No certificates have been issued for this event yet.
          </div>
        ) : (
          <div className="border rounded-md">
            <div className="grid grid-cols-1 p-4 font-medium border-b">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">Certificate ID</div>
                <div className="col-span-3">Attendee</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-2">Issued Date</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
            
            <div className="divide-y">
              {certificates.map(cert => (
                <div key={cert.id} className="p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3 truncate">
                      <span className="font-mono text-sm">{cert.id}</span>
                    </div>
                    <div className="col-span-3 truncate">{cert.user_name}</div>
                    <div className="col-span-2 truncate">{cert.user_email}</div>
                    <div className="col-span-2">
                      {new Date(cert.issued_date).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 flex space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(cert.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendEmail(cert.id, cert.user_email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
