
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/utils/certificates";
import { CertificateActions } from "./CertificateActions";

interface CertificateTableRowProps {
  certificate: Certificate;
  onPreview: (certificate: Certificate) => void;
  onDownload: (certificateId: string) => void;
  onSendEmail: (certificateId: string, email: string) => void;
}

export function CertificateTableRow({
  certificate,
  onPreview,
  onDownload,
  onSendEmail
}: CertificateTableRowProps) {
  return (
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
        <CertificateActions
          certificateId={certificate.id}
          userEmail={certificate.user_email}
          isSent={certificate.sent_email}
          onPreview={() => onPreview(certificate)}
          onDownload={onDownload}
          onSendEmail={onSendEmail}
        />
      </TableCell>
    </TableRow>
  );
}
