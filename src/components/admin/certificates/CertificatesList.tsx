
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  fetchCertificatesByEvent, 
  generateCertificateContent 
} from "@/utils/certificates";
import { CertificatesTable } from "./CertificatesTable";
import { CertificatePreviewDialog } from "./CertificatePreviewDialog";
import { generateCertificatePDF } from "@/utils/pdf-generator";

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
        generateCertificatePDF(content, userName, certificateId);
        
        // Update certificate download status via API
        fetch(`/api/get-certificate.php?id=${certificateId}&download=true`)
          .then(response => {
            if (!response.ok) {
              console.warn("Failed to update certificate download status");
            }
            return response.json();
          })
          .catch(err => {
            console.error("Error updating certificate status:", err);
          });
          
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

      generateCertificatePDF(certificateContent, certificate.user_name, certificate.id);
      
      // Update certificate download status via API
      fetch(`/api/get-certificate.php?id=${certificateId}&download=true`)
        .then(response => {
          if (!response.ok) {
            console.warn("Failed to update certificate download status");
          }
          return response.json();
        })
        .catch(err => {
          console.error("Error updating certificate status:", err);
        });
      
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Error downloading certificate");
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
          <CertificatesTable 
            certificates={certificates}
            isLoading={isLoading}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onSendEmail={handleSendEmail}
          />
        </CardContent>
      </Card>

      <CertificatePreviewDialog 
        open={!!previewCertificate}
        onOpenChange={(open) => !open && setPreviewCertificate(null)}
        previewCertificate={previewCertificate}
        onDownload={handleDownload}
      />
    </>
  );
}
