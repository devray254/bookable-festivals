
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
import { toast } from "sonner";
import { 
  fetchCertificatesByEvent, 
  generateCertificateContent 
} from "@/utils/certificates";
import jsPDF from "jspdf";

interface CertificatesListProps {
  eventId: number;
}

export function CertificatesList({ eventId }: CertificatesListProps) {
  const [previewCertificate, setPreviewCertificate] = useState<{
    id: string;
    content: string;
    userName: string;
  } | null>(null);

  const { data: certificates = [], isLoading, refetch } = useQuery({
    queryKey: ['certificates', eventId],
    queryFn: () => fetchCertificatesByEvent(eventId)
  });

  const handlePreview = (certificate: any) => {
    try {
      if (!certificate.user_name || !certificate.event_title) {
        toast.error("Certificate data is incomplete");
        return;
      }

      // Use event_title or a default value for the event date display
      // Since event_date is not in the Certificate interface, we'll use issued_date instead
      const eventDate = new Date().toLocaleDateString(); // Default to current date
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
    } catch (error) {
      console.error("Error previewing certificate:", error);
      toast.error("Error previewing certificate");
    }
  };

  const handleDownload = (certificateId: string, userName?: string, content?: string) => {
    try {
      // If content is provided, generate PDF directly
      if (content && userName) {
        generatePDF(content, userName);
        return;
      }

      // Find the certificate by ID
      const certificate = certificates.find(cert => cert.id === certificateId);
      
      if (!certificate || !certificate.user_name || !certificate.event_title) {
        console.error("Certificate data is incomplete");
        toast.error("Certificate data is incomplete");
        return;
      }
      
      // Use a default date for the event date since we don't have event_date in the Certificate interface
      const eventDate = new Date().toLocaleDateString();
      const issuedDate = new Date(certificate.issued_date).toLocaleDateString();

      const certificateContent = generateCertificateContent(
        certificate.user_name,
        certificate.event_title,
        eventDate,
        issuedDate
      );

      generatePDF(certificateContent, certificate.user_name);
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Error downloading certificate");
    }
  };

  const generatePDF = (content: string, userName: string) => {
    try {
      // Create a new PDF document in A4 landscape format
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set basic styling
      pdf.setFont("helvetica", "normal");
      
      // Add a border
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
      
      // Add decorative elements
      pdf.setDrawColor(128, 0, 128); // Purple color
      pdf.setLineWidth(2);
      pdf.line(margin * 2, margin * 2, pageWidth - margin * 2, margin * 2);
      pdf.line(margin * 2, pageHeight - margin * 2, pageWidth - margin * 2, pageHeight - margin * 2);
      
      // Add logo or header
      pdf.setFontSize(24);
      pdf.setTextColor(70, 70, 70);
      pdf.text("Certificate of Participation", pageWidth / 2, 30, { align: "center" });
      
      // Format and add the content
      const lines = content.split('\n');
      
      let y = 50;
      let fontSize = 12;
      
      // Process each line
      lines.forEach(line => {
        // Skip empty lines
        if (!line.trim()) return;
        
        // Check for header lines
        if (line.includes("Certificate of Participation")) return; // Skip title, already added
        
        // Check for bold text
        if (line.includes("**")) {
          const boldText = line.replace(/\*\*(.*?)\*\*/g, "$1");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.text(boldText, pageWidth / 2, y, { align: "center" });
        } 
        // Check for signature line
        else if (line.includes("_______")) {
          y += 15;
          pdf.setLineWidth(0.5);
          pdf.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);
          y += 5;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text("Maabara Online", pageWidth / 2, y, { align: "center" });
        }
        // Regular text
        else {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSize);
          pdf.text(line, pageWidth / 2, y, { align: "center" });
        }
        
        // Increase vertical position
        y += 10;
      });
      
      // Add background watermark
      pdf.setTextColor(230, 230, 230);
      pdf.setFontSize(60);
      pdf.text("MAABARA", pageWidth / 2, pageHeight / 2, { 
        align: "center",
        angle: 45
      });
      
      // Save the PDF
      pdf.save(`Certificate-${userName.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
  };

  const handleSendEmail = (certificateId: string, email: string) => {
    try {
      // In a real app, this would send an email with the certificate
      console.log("Sending certificate to:", email);
      toast.success(`Certificate would be emailed to ${email} in production`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email");
    }
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
              <Button onClick={() => previewCertificate && handleDownload(
                previewCertificate.id,
                previewCertificate.userName,
                previewCertificate.content
              )}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
