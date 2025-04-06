
import { Button } from "@/components/ui/button";
import { Eye, Download, Mail, MailCheck, Loader2 } from "lucide-react";
import { useState } from "react";

interface CertificateActionsProps {
  certificateId: string;
  userEmail?: string;
  isSent: boolean;
  onPreview: () => void;
  onDownload: (certificateId: string) => void;
  onSendEmail: (certificateId: string, email: string) => void;
}

export function CertificateActions({
  certificateId,
  userEmail,
  isSent,
  onPreview,
  onDownload,
  onSendEmail
}: CertificateActionsProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!userEmail) return;
    
    setIsSending(true);
    try {
      await onSendEmail(certificateId, userEmail);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreview}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDownload(certificateId)}
      >
        <Download className="h-4 w-4" />
      </Button>
      {!isSent && userEmail && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSendEmail}
          disabled={isSending}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      )}
      {isSent && (
        <Button
          variant="outline"
          size="sm"
          disabled
        >
          <MailCheck className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
