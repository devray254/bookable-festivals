
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking, updateAttendanceStatus } from "@/utils/bookings";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logActivity } from "@/utils/logs";

interface UpdateEligibilityDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  adminEmail: string;
}

export function UpdateEligibilityDialog({
  booking,
  open,
  onOpenChange,
  onSuccess,
  adminEmail
}: UpdateEligibilityDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<string>(booking?.attendance_status || "unverified");
  const [enableCertificate, setEnableCertificate] = useState<boolean>(
    booking?.certificate_enabled || false
  );

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (open && booking) {
      setStatus(booking.attendance_status || "unverified");
      setEnableCertificate(booking.certificate_enabled || false);
    }
    onOpenChange(open);
  };

  const handleUpdate = async () => {
    if (!booking) return;
    
    setIsUpdating(true);
    
    try {
      const result = await updateAttendanceStatus(
        booking.id,
        status as "attended" | "partial" | "absent" | "unverified", 
        enableCertificate
      );
      
      if (result.success) {
        toast.success("Certificate eligibility updated successfully");
        
        // Log the activity
        await logActivity({
          action: "certificate_eligibility_updated",
          user: adminEmail,
          details: `Updated certificate eligibility for booking ${booking.id}, user ${booking.user_id}`,
          level: "info"
        });
        
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update eligibility");
      }
    } catch (error) {
      console.error("Error updating certificate eligibility:", error);
      toast.error("An error occurred while updating eligibility");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Certificate Eligibility</DialogTitle>
        </DialogHeader>
        
        {booking && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-status">Attendance Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="attendance-status">
                  <SelectValue placeholder="Select attendance status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attended">Fully Attended</SelectItem>
                  <SelectItem value="partial">Partially Attended</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="unverified">Not Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="certificate-access">Override Certificate Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow this user to download certificates regardless of attendance
                </p>
              </div>
              <Switch 
                id="certificate-access" 
                checked={enableCertificate}
                onCheckedChange={setEnableCertificate}
              />
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Users can download certificates if they fully attended the event 
                OR if the certificate access override is enabled.
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Update
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
