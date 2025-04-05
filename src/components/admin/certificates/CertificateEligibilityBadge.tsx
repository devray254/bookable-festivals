
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Booking } from "@/utils/bookings";

interface CertificateEligibilityBadgeProps {
  booking: Booking;
}

export function CertificateEligibilityBadge({ booking }: CertificateEligibilityBadgeProps) {
  // Determine status
  let isEligible = false;
  let reason = "";
  
  if (booking.certificate_enabled) {
    isEligible = true;
    reason = "Certificate access has been manually enabled by an admin";
  } else if (booking.attendance_status === "attended") {
    isEligible = true;
    reason = "User fully attended the event";
  } else if (booking.attendance_status === "partial") {
    isEligible = false;
    reason = "User only partially attended the event";
  } else if (booking.attendance_status === "absent") {
    isEligible = false;
    reason = "User did not attend the event";
  } else {
    isEligible = false;
    reason = "Attendance has not been verified";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={isEligible ? "default" : "destructive"}>
            {isEligible ? "Eligible" : "Not Eligible"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{reason}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
