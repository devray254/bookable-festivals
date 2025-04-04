
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsSummaryCards } from "@/components/admin/payments/PaymentsSummaryCards";
import { PaymentsTabs } from "@/components/admin/payments/PaymentsTabs";
import { usePayments } from "@/components/admin/payments/usePayments";

export default function AdminPayments() {
  const {
    payments,
    successfulPayments,
    pendingPayments,
    failedPayments,
    totalRevenue,
    isLoading,
    error
  } = usePayments();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Track all payment transactions</p>
        </div>
        
        <PaymentsSummaryCards 
          payments={payments}
          successfulPayments={successfulPayments}
          totalRevenue={totalRevenue}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentsTabs
              allPayments={payments}
              successfulPayments={successfulPayments}
              pendingPayments={pendingPayments}
              failedPayments={failedPayments}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
