
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { UIPayment } from "./types";

interface PaymentsTableProps {
  payments: UIPayment[];
  isLoading: boolean;
  error: unknown;
}

export function PaymentsTable({ payments, isLoading, error }: PaymentsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading payments data. Please try again.
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No payments found in this category.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Amount (KES)</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.event}</TableCell>
              <TableCell>{payment.customer}</TableCell>
              <TableCell>{payment.phone}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={payment.status} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
