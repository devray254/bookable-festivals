
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";

interface BulkEmailButtonProps {
  onClick: () => void;
  isSending: boolean;
  disabled: boolean;
}

export function BulkEmailButton({ onClick, isSending, disabled }: BulkEmailButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant="outline"
      className="flex items-center gap-2"
      disabled={isSending || disabled}
    >
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          Send All by Email
        </>
      )}
    </Button>
  );
}
