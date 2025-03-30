
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";

export default function AdminPayments() {
  const payments = [
    {
      id: "MPE123456",
      booking: 1,
      event: "Science Exhibition",
      customer: "John Doe",
      phone: "0712345678",
      amount: "1000",
      date: "2023-08-15 14:22:30",
      method: "M-Pesa",
      status: "successful"
    },
    {
      id: "MPE234567",
      booking: 2,
      event: "Tech Workshop",
      customer: "Jane Smith",
      phone: "0723456789",
      amount: "750",
      date: "2023-08-20 10:15:45",
      method: "M-Pesa",
      status: "successful"
    },
    {
      id: "MPE345678",
      booking: 3,
      event: "Chemistry Seminar",
      customer: "Mike Johnson",
      phone: "0734567890",
      amount: "900",
      date: "2023-08-25 16:30:10",
      method: "M-Pesa",
      status: "pending"
    },
    {
      id: "MPE456789",
      booking: 4,
      event: "Tech Workshop",
      customer: "Sarah Williams",
      phone: "0745678901",
      amount: "1500",
      date: "2023-08-20 11:45:22",
      method: "M-Pesa",
      status: "failed"
    }
  ];

  const successfulPayments = payments.filter(payment => payment.status === "successful");
  const pendingPayments = payments.filter(payment => payment.status === "pending");
  const failedPayments = payments.filter(payment => payment.status === "failed");

  const renderPaymentTable = (paymentsList: typeof payments) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Transaction ID</th>
            <th className="text-left p-2">Event</th>
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">Amount (KES)</th>
            <th className="text-left p-2">Date & Time</th>
            <th className="text-left p-2">Method</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paymentsList.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="p-2">{payment.id}</td>
              <td className="p-2">{payment.event}</td>
              <td className="p-2">{payment.customer}</td>
              <td className="p-2">{payment.phone}</td>
              <td className="p-2">{payment.amount}</td>
              <td className="p-2">{payment.date}</td>
              <td className="p-2">{payment.method}</td>
              <td className="p-2">
                <Badge variant={
                  payment.status === "successful" ? "default" : 
                  payment.status === "pending" ? "secondary" : "destructive"
                }>
                  {payment.status}
                </Badge>
              </td>
              <td className="p-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Track all payment transactions</p>
        </div>
        
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
                KES {successfulPayments.reduce((sum, payment) => sum + parseInt(payment.amount), 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="successful">Successful</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderPaymentTable(payments)}
              </TabsContent>
              
              <TabsContent value="successful">
                {renderPaymentTable(successfulPayments)}
              </TabsContent>
              
              <TabsContent value="pending">
                {renderPaymentTable(pendingPayments)}
              </TabsContent>
              
              <TabsContent value="failed">
                {renderPaymentTable(failedPayments)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
