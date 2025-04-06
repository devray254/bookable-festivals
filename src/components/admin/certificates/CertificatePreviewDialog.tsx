
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Download } from "lucide-react";

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
  if (!previewCertificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Certificate Preview</DialogTitle>
        </DialogHeader>
        
        <div 
          className="certificate-preview border p-6 my-4 rounded-md" 
          dangerouslySetInnerHTML={{ __html: previewCertificate.content }}
        />
        
        <DialogFooter>
          <Button 
            onClick={() => onDownload(
              previewCertificate.id, 
              previewCertificate.userName, 
              previewCertificate.content
            )}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
