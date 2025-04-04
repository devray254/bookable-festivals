
import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: string;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <Badge variant={
      status === "successful" ? "default" : 
      status === "pending" ? "secondary" : "destructive"
    }>
      {status}
    </Badge>
  );
}
