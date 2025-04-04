
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Loader2, Eye } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  fetchCertificatesByEvent, 
  generateCertificateContent 
} from "@/utils/certificates";

interface CertificatesListProps {
  eventId: number;
}

export function CertificatesList({ eventId }: CertificatesListProps) {
  const [previewCertificate, setPreviewCertificate] = useState<{
    id: string;
    content: string;
    userName: string;
  } | null>(null);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates', eventId],
    queryFn: () => fetchCertificatesByEvent(eventId)
  });

  const handlePreview = (certificate: any) => {
    if (!certificate.user_name || !certificate.event_title) {
      return;
    }

    const eventDate = certificate.event_date 
      ? new Date(certificate.event_date).toLocaleDateString()
      : new Date().toLocaleDateString();

    const issuedDate = new Date(certificate.issued_date).toLocaleDateString();

    const content = generateCertificateContent(
      certificate.user_name,
      certificate.event_title,
      eventDate,
      issuedDate
    );

    setPreviewCertificate({
      id: certificate.id,
      content,
      userName: certificate.user_name
    });
  };

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
    <>
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
                          onClick={() => handlePreview(cert)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                          onClick={() => handleSendEmail(cert.id, cert.user_email as string)}
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

      <Dialog open={!!previewCertificate} onOpenChange={(open) => !open && setPreviewCertificate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              Certificate for {previewCertificate?.userName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white p-6 border rounded-md shadow-sm">
            <div className="certificate-content whitespace-pre-line">
              {previewCertificate?.content}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewCertificate(null)}>
              Close
            </Button>
            {previewCertificate && (
              <Button onClick={() => handleDownload(previewCertificate.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
