
import { Button } from "@/components/ui/button";
import { Download, Mail, Eye, Loader2 } from "lucide-react";

interface Certificate {
  id: string;
  event_id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  event_title?: string;
  issued_date: string;
  issued_by: string;
  sent_email: boolean;
  downloaded: boolean;
}

interface CertificatesTableProps {
  certificates: Certificate[];
  isLoading: boolean;
  onPreview: (certificate: any) => void;
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
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-eventPurple-700" />
      </div>
    );
  }
  
  if (certificates.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No certificates have been issued for this event yet.
      </div>
    );
  }
  
  return (
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
                  onClick={() => onPreview(cert)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(cert.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => onSendEmail(cert.id, cert.user_email as string)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
