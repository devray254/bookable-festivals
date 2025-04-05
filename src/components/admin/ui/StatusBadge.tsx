
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "error" | "info" | "pending" | "default";

interface StatusConfig {
  label: string;
  className: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const STATUS_STYLES: Record<StatusVariant, StatusConfig> = {
  success: {
    label: "Success",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    variant: "outline"
  },
  warning: {
    label: "Warning",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    variant: "outline"
  },
  error: {
    label: "Error",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
    variant: "outline"
  },
  info: {
    label: "Info",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    variant: "outline"
  },
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    variant: "outline"
  },
  default: {
    label: "Default",
    className: "",
    variant: "outline"
  }
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  customStatuses?: Record<string, StatusConfig>;
  className?: string;
}

export function StatusBadge({ 
  status, 
  label, 
  customStatuses = {}, 
  className 
}: StatusBadgeProps) {
  // Combine default statuses with custom ones
  const allStatuses = { ...STATUS_STYLES, ...customStatuses };
  
  // Get status config, defaulting to 'default' if not found
  const statusConfig = allStatuses[status as StatusVariant] || allStatuses.default;
  
  return (
    <Badge 
      variant={statusConfig.variant} 
      className={cn(statusConfig.className, className)}
    >
      {label || statusConfig.label}
    </Badge>
  );
}
