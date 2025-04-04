
import { Button } from "@/components/ui/button";
import { Award, Loader2 } from "lucide-react";

interface BulkCertificateSectionProps {
  isBulkGenerating: boolean;
  onBulkGenerate: () => Promise<void>;
}

export function BulkCertificateSection({
  isBulkGenerating,
  onBulkGenerate,
}: BulkCertificateSectionProps) {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Bulk Certificate Generation</h3>
        <Button
          onClick={onBulkGenerate}
          disabled={isBulkGenerating}
        >
          {isBulkGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" />
              Generate For All Paid Attendees
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        This will generate certificates for all users who have paid for this event and have not yet received a certificate.
      </p>
    </div>
  );
}
