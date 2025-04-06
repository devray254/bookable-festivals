
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/utils/certificates";
import { 
  Award, 
  Download, 
  Eye, 
  Mail, 
  MailCheck,
  Loader2
} from "lucide-react";

interface CertificatesTableProps {
  certificates: Certificate[];
  isLoading: boolean;
  onPreview: (certificate: Certificate) => void;
  onDownload: (certificateId: string) => void;
  onSendEmail: (certificateId: string, email: string) => void;
}

export function CertificatesTable({
  certificates,
  isLoading,
  onPreview,
  onDownload,
  onSendEmail
}: CertificatesTableProps) {
  const [sendingEmail, setSendingEmail] = useState<Record<string, boolean>>({});

  const handleSendEmail = async (certificateId: string, email: string) => {
    if (!email) return;
    
    setSendingEmail(prev => ({ ...prev, [certificateId]: true }));
    try {
      await onSendEmail(certificateId, email);
    } finally {
      setSendingEmail(prev => ({ ...prev, [certificateId]: false }));
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
      <div className="py-8 text-center">
        <Award className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-base font-semibold text-gray-900">No certificates</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are no certificates issued for this event yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead>Email Status</TableHead>
            <TableHead>Downloaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate) => (
            <TableRow key={certificate.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{certificate.user_name}</div>
                  <div className="text-xs text-gray-500">{certificate.user_email}</div>
                </div>
              </TableCell>
              <TableCell>
                {new Date(certificate.issued_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={certificate.sent_email ? "default" : "outline"}>
                  {certificate.sent_email ? "Sent" : "Not sent"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={certificate.downloaded ? "default" : "outline"}>
                  {certificate.downloaded ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(certificate)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(certificate.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!certificate.sent_email && certificate.user_email && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendEmail(certificate.id, certificate.user_email)}
                      disabled={sendingEmail[certificate.id]}
                    >
                      {sendingEmail[certificate.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {certificate.sent_email && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      <MailCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
