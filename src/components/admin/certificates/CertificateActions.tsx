
import { Button } from "@/components/ui/button";
import { Award, Loader2 } from "lucide-react";

interface CertificateActionsProps {
  selectAllUsers: () => void;
  clearSelection: () => void;
  handleGenerateCertificates: () => Promise<void>;
  selectedUsers: number[];
  isGenerating: boolean;
}

export function CertificateActions({
  selectAllUsers,
  clearSelection,
  handleGenerateCertificates,
  selectedUsers,
  isGenerating,
}: CertificateActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={selectAllUsers}
      >
        Select All
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={clearSelection} 
        disabled={selectedUsers.length === 0}
      >
        Clear
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        disabled={selectedUsers.length === 0 || isGenerating}
        onClick={handleGenerateCertificates}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
