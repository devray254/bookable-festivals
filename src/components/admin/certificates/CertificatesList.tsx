
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

      const eventDate = new Date().toLocaleDateString();
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
      if (content && userName) {
        generatePDF(content, userName, certificateId);
        return;
      }

      const certificate = certificates.find(cert => cert.id === certificateId);
      
      if (!certificate || !certificate.user_name || !certificate.event_title) {
        console.error("Certificate data is incomplete");
        toast.error("Certificate data is incomplete");
        return;
      }
      
      const eventDate = new Date().toLocaleDateString();
      const issuedDate = new Date(certificate.issued_date).toLocaleDateString();

      const certificateContent = generateCertificateContent(
        certificate.user_name,
        certificate.event_title,
        eventDate,
        issuedDate
      );

      generatePDF(certificateContent, certificate.user_name, certificate.id);
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Error downloading certificate");
    }
  };

  const generatePDF = (content: string, userName: string, certificateId: string) => {
    try {
      // Create the PDF with landscape orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set background color (off-white/cream)
      pdf.setFillColor(251, 249, 240);
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add decorative border
      const borderWidth = 15;
      const margin = 10;
      
      // Add dark vertical bars on the right (similar to the image)
      pdf.setFillColor(30, 25, 15);
      pdf.rect(pageWidth - 30, 0, 15, pageHeight, 'F');
      pdf.setFillColor(50, 40, 25);
      pdf.rect(pageWidth - 40, 0, 5, pageHeight, 'F');
      
      // Add decorative border pattern
      pdf.setDrawColor(200, 190, 170);
      pdf.setLineWidth(0.5);
      
      // Top border pattern
      for (let x = margin; x < pageWidth - margin - 45; x += 10) {
        pdf.line(x, margin, x + 5, margin);
        pdf.line(x + 5, margin, x + 5, margin + 5);
        pdf.line(x + 5, margin + 5, x + 10, margin + 5);
      }
      
      // Bottom border pattern
      for (let x = margin; x < pageWidth - margin - 45; x += 10) {
        pdf.line(x, pageHeight - margin, x + 5, pageHeight - margin);
        pdf.line(x + 5, pageHeight - margin, x + 5, pageHeight - margin - 5);
        pdf.line(x + 5, pageHeight - margin - 5, x + 10, pageHeight - margin - 5);
      }
      
      // Left border pattern
      for (let y = margin; y < pageHeight - margin; y += 10) {
        pdf.line(margin, y, margin, y + 5);
        pdf.line(margin, y + 5, margin + 5, y + 5);
        pdf.line(margin + 5, y + 5, margin + 5, y + 10);
      }
      
      // Right border pattern
      for (let y = margin; y < pageHeight - margin; y += 10) {
        pdf.line(pageWidth - margin - 45, y, pageWidth - margin - 45, y + 5);
        pdf.line(pageWidth - margin - 45, y + 5, pageWidth - margin - 50, y + 5);
        pdf.line(pageWidth - margin - 50, y + 5, pageWidth - margin - 50, y + 10);
      }
      
      // Add "MAABARAONLINE" watermark text with very light opacity
      pdf.setTextColor(230, 225, 215);
      pdf.setFontSize(12);
      
      // Add watermark in a grid pattern
      for (let x = 20; x < pageWidth - 60; x += 40) {
        for (let y = 30; y < pageHeight - 20; y += 20) {
          pdf.saveGraphicsState();
          pdf.text("MAABARAONLINE", x, y, { 
            angle: 30,
            charSpace: 0
          });
          pdf.restoreGraphicsState();
        }
      }
      
      // Company name
      pdf.setTextColor(80, 60, 20);
      pdf.setFontSize(14);
      pdf.text("□ Maabara Online", margin + 15, margin + 20);
      
      // Certificate title
      pdf.setFont("times", "normal");
      pdf.setFontSize(40);
      pdf.text("Participation", margin + 15, margin + 50);
      
      pdf.setFont("times", "italic");
      pdf.text("Certificate", margin + 110, margin + 50);
      
      // "Is hereby presented to" text
      pdf.setFont("times", "normal");
      pdf.setFontSize(16);
      pdf.text("Is hereby presented to", margin + 15, margin + 65);
      
      // Recipient name
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(36);
      pdf.setTextColor(60, 40, 10);
      pdf.text(userName, margin + 15, margin + 85);
      
      // Underline below name
      pdf.setDrawColor(60, 40, 10);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 15, margin + 90, pageWidth - margin - 60, margin + 90);
      
      // Parse certificate content
      const contentLines = content.split('\n');
      let eventTitle = "";
      let eventDate = "";
      
      // Extract event information from content
      for (const line of contentLines) {
        if (line.includes("Event Title")) {
          eventTitle = line.replace(/.*"(.+)".*/, "$1");
        }
        if (line.includes("Event Date")) {
          eventDate = line.replace(/.*\[Event Date\].*/, "Event Date");
        }
      }
      
      // Description text
      pdf.setFont("times", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(100, 80, 40);
      
      const description = `Demonstrated exceptional engagement and involvement during "${eventTitle}", which took place on ${eventDate}, actively participating in all sessions.`;
      
      // Word wrap the description
      const splitDescription = pdf.splitTextToSize(description, pageWidth - margin - 80 - margin);
      pdf.text(splitDescription, margin + 15, margin + 105);
      
      // Signatures
      pdf.setFont("times", "normal");
      pdf.setFontSize(16);
      pdf.setTextColor(80, 60, 30);
      pdf.text("CEO Maabara Online", margin + 25, pageHeight - margin - 30);
      
      pdf.text("CTO Maabara Online", pageWidth/2 + 25, pageHeight - margin - 30);
      
      // Signature lines
      pdf.setDrawColor(80, 60, 30);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 15, pageHeight - margin - 40, margin + 90, pageHeight - margin - 40);
      pdf.line(pageWidth/2 + 15, pageHeight - margin - 40, pageWidth/2 + 90, pageHeight - margin - 40);
      
      // Certificate ID and awarded date
      pdf.setFontSize(12);
      pdf.text(`Certificate ID: ${certificateId}`, margin + 15, pageHeight - margin - 15);
      
      const issuedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
      
      pdf.text(`Awarded on: ${issuedDate}`, pageWidth/2 + 15, pageHeight - margin - 15);
      
      pdf.save(`Certificate-${userName.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
  };

  const handleSendEmail = (certificateId: string, email: string) => {
    try {
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
