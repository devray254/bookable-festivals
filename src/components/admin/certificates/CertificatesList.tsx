
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CertificatesTable } from "./CertificatesTable";
import { CertificatePreviewDialog } from "./CertificatePreviewDialog";
import { EmailBulkDialog } from "./EmailBulkDialog";
import { BulkEmailButton } from "./BulkEmailButton";
import { useCertificates } from "./hooks/useCertificates";

interface CertificatesListProps {
  eventId: number;
}

export function CertificatesList({ eventId }: CertificatesListProps) {
  const {
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
  } = useCertificates(eventId);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Issued Certificates</CardTitle>
          <BulkEmailButton 
            onClick={() => setShowBulkEmailDialog(true)}
            isSending={isSendingBulkEmail}
            disabled={certificates.length === 0}
          />
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
      
      <EmailBulkDialog
        open={showBulkEmailDialog}
        onOpenChange={setShowBulkEmailDialog}
        onSend={handleSendBulkEmails}
        isSending={isSendingBulkEmail}
        certificateCount={certificates.filter(cert => !cert.sent_email).length}
      />
    </>
  );
}
