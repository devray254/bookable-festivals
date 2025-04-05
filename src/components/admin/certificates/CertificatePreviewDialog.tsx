
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface CertificatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewCertificate: {
    id: string;
    content: string;
    userName: string;
  } | null;
  onDownload: (certificateId: string, userName: string, content: string) => void;
}

export function CertificatePreviewDialog({
  open,
  onOpenChange,
  previewCertificate,
  onDownload
}: CertificatePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Certificate Preview</DialogTitle>
          <DialogDescription>
            Certificate for {previewCertificate?.userName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-white p-6 border rounded-md shadow-sm">
          <div className="certificate-content whitespace-pre-line">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/624a13a0-9731-45c5-a0dd-e552425a8c41.png" 
                alt="Maabara Online Logo" 
                className="h-12 object-contain" 
              />
            </div>
            {previewCertificate?.content}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {previewCertificate && (
            <Button onClick={() => previewCertificate && onDownload(
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
  );
}
