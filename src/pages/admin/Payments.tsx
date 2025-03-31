
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { fetchPayments } from "@/utils/payments";

interface Payment {
  id: string;
  booking_id: number;
  event: string;
  customer: string;
  phone: string;
  amount: string;
  date: string;
  method: string;
  status: string;
}

export default function AdminPayments() {
  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments
  });

  // Filter payments by status
  const successfulPayments = payments.filter(payment => payment.status === "successful");
  const pendingPayments = payments.filter(payment => payment.status === "pending");
  const failedPayments = payments.filter(payment => payment.status === "failed");

  // Calculate total revenue
  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const renderPaymentTable = (paymentsList: Payment[]) => (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">
          Error loading payments data. Please try again.
        </div>
      ) : paymentsList.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No payments found in this category.
        </div>
      ) : (
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
      )}
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
                KES {totalRevenue.toLocaleString()}
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
