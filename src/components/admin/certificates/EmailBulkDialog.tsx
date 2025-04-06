
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";

interface EmailBulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (customMessage: string) => Promise<void>;
  isSending: boolean;
  certificateCount: number;
}

export function EmailBulkDialog({
  open,
  onOpenChange,
  onSend,
  isSending,
  certificateCount
}: EmailBulkDialogProps) {
  const [customMessage, setCustomMessage] = useState(
    "We are pleased to present your certificate of participation. " +
    "You can find it attached to this email. Thank you for your attendance!"
  );

  const handleSend = async () => {
    await onSend(customMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Certificates by Email</DialogTitle>
          <DialogDescription>
            This will send email certificates to all participants who haven't received them yet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {certificateCount > 0 ? (
            <>
              <div className="text-sm">
                <span className="font-medium">{certificateCount}</span> certificate(s) will be sent.
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-message">Custom Message</Label>
                <Textarea
                  id="custom-message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter a custom message to include in the email"
                  rows={4}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-amber-600">
              All certificates have already been sent by email.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={isSending || certificateCount === 0}
            className="flex items-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Emails
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
