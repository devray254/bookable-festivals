
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Download, 
  Mail, 
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendCertificateEmail } from "@/utils/certificates";

interface Certificate {
  id: string;
  user_name: string;
  user_email: string;
  event_title: string;
  issued_date: string;
  downloaded: boolean;
  sent_email: boolean;
}

interface CertificatesTableProps {
  certificates: Certificate[];
  isLoading: boolean;
  onPreview: (certificate: Certificate) => void;
  onDownload: (certificateId: string, userName?: string, content?: string) => void;
  onSendEmail: (certificateId: string, email: string) => void;
}

export function CertificatesTable({ 
  certificates, 
  isLoading, 
  onPreview, 
  onDownload,
  onSendEmail 
}: CertificatesTableProps) {
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const handleSendEmail = async (certificateId: string, email: string) => {
    setSendingEmail(certificateId);
    try {
      await onSendEmail(certificateId, email);
    } finally {
      setSendingEmail(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No certificates have been issued for this event yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Certificate ID</th>
            <th className="text-left py-2 px-3">Recipient</th>
            <th className="text-left py-2 px-3">Email</th>
            <th className="text-left py-2 px-3">Issued Date</th>
            <th className="text-left py-2 px-3">Status</th>
            <th className="text-left py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3 font-mono text-xs">{certificate.id}</td>
              <td className="py-2 px-3">{certificate.user_name}</td>
              <td className="py-2 px-3">{certificate.user_email}</td>
              <td className="py-2 px-3">
                {new Date(certificate.issued_date).toLocaleDateString()}
              </td>
              <td className="py-2 px-3">
                <div className="flex flex-col gap-1">
                  <Badge variant={certificate.downloaded ? "default" : "outline"} className="w-fit">
                    {certificate.downloaded ? "Downloaded" : "Not Downloaded"}
                  </Badge>
                  <Badge variant={certificate.sent_email ? "success" : "outline"} className="w-fit">
                    {certificate.sent_email ? "Email Sent" : "No Email Sent"}
                  </Badge>
                </div>
              </td>
              <td className="py-2 px-3">
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onPreview(certificate)}
                    title="Preview Certificate"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDownload(certificate.id)}
                    title="Download Certificate"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleSendEmail(certificate.id, certificate.user_email)}
                    disabled={sendingEmail === certificate.id}
                    title="Send by Email"
                  >
                    {sendingEmail === certificate.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : certificate.sent_email ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
