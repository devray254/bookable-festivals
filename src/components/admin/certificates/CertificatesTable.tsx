
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Certificate } from "@/utils/certificates";
import { CertificateTableRow } from "./CertificateTableRow";
import { CertificateEmptyState } from "./CertificateEmptyState";
import { Loader2 } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (certificates.length === 0) {
    return <CertificateEmptyState />;
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
            <CertificateTableRow
              key={certificate.id}
              certificate={certificate}
              onPreview={onPreview}
              onDownload={onDownload}
              onSendEmail={onSendEmail}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
