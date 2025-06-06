
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchCertificatesByEvent, 
  generateCertificateContent,
  sendCertificateEmail,
  sendBulkCertificateEmails,
  Certificate
} from "@/utils/certificates";
import { generateCertificatePDF } from "@/utils/pdf-generator";

export function useCertificates(eventId: number) {
  const [previewCertificate, setPreviewCertificate] = useState<{
    id: string;
    content: string;
    userName: string;
  } | null>(null);
  
  const [showBulkEmailDialog, setShowBulkEmailDialog] = useState(false);
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);

  const { data: certificates = [], isLoading, refetch } = useQuery({
    queryKey: ['certificates', eventId],
    queryFn: () => fetchCertificatesByEvent(eventId)
  });

  const handlePreview = (certificate: Certificate) => {
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

  const handleSendEmail = async (certificateId: string, email: string) => {
    try {
      const certificate = certificates.find(cert => cert.id === certificateId);
      
      if (!certificate) {
        toast.error("Certificate not found");
        return;
      }
      
      const result = await sendCertificateEmail(certificateId, email);
      
      if (result.success) {
        toast.success(`Certificate sent to ${email}`);
        refetch(); // Refresh the list to update sent status
      } else {
        toast.error(result.message || "Failed to send certificate");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email");
    }
  };
  
  const handleSendBulkEmails = async (customMessage: string) => {
    setIsSendingBulkEmail(true);
    try {
      // Filter certificates that haven't been emailed yet
      const certificatesToSend = certificates.filter(cert => !cert.sent_email);
      
      if (certificatesToSend.length === 0) {
        toast.info("No certificates to send. All certificates have already been emailed.");
        return;
      }
      
      const result = await sendBulkCertificateEmails(eventId, customMessage);
      
      if (result.success) {
        toast.success(`Successfully sent ${result.sent} out of ${result.total} certificates`);
        setShowBulkEmailDialog(false);
        refetch(); // Refresh the list to update sent status
      } else {
        toast.error(result.message || "Failed to send bulk emails");
      }
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      toast.error("Error sending bulk emails");
    } finally {
      setIsSendingBulkEmail(false);
    }
  };

  return {
    certificates,
    isLoading,
    previewCertificate,
    setPreviewCertificate,
    showBulkEmailDialog,
    setShowBulkEmailDialog,
    isSendingBulkEmail,
    handlePreview,
    handleDownload,
    handleSendEmail,
    handleSendBulkEmails
  };
}
