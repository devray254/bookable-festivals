
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UIPayment } from "./types";

interface PaymentsSummaryCardsProps {
  payments: UIPayment[];
  successfulPayments: UIPayment[];
  totalRevenue: number;
}

export function PaymentsSummaryCards({ 
  payments, 
  successfulPayments, 
  totalRevenue 
}: PaymentsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{payments.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successfulPayments.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            KES {totalRevenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
