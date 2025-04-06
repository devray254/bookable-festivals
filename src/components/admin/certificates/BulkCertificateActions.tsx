
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, Award } from "lucide-react";

interface BulkCertificateActionsProps {
  selectAllUsers: () => void;
  clearSelection: () => void;
  handleGenerateCertificates: () => Promise<void>;
  selectedUsers: number[];
  isGenerating: boolean;
}

export function BulkCertificateActions({
  selectAllUsers,
  clearSelection,
  handleGenerateCertificates,
  selectedUsers,
  isGenerating
}: BulkCertificateActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={selectAllUsers}
      >
        <Users className="mr-2 h-4 w-4" />
        Select All
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={clearSelection}
        disabled={selectedUsers.length === 0}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Clear Selection
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={handleGenerateCertificates}
        disabled={isGenerating || selectedUsers.length === 0}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Generating...
          </>
        ) : (
          <>
            <Award className="mr-2 h-4 w-4" />
            Generate Selected
          </>
        )}
      </Button>
    </div>
  );
}
