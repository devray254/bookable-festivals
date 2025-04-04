
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentsTable } from "./PaymentsTable";
import { UIPayment } from "./types";

interface PaymentsTabsProps {
  allPayments: UIPayment[];
  successfulPayments: UIPayment[];
  pendingPayments: UIPayment[];
  failedPayments: UIPayment[];
  isLoading: boolean;
  error: unknown;
}

export function PaymentsTabs({
  allPayments,
  successfulPayments,
  pendingPayments,
  failedPayments,
  isLoading,
  error
}: PaymentsTabsProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="successful">Successful</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="failed">Failed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <PaymentsTable payments={allPayments} isLoading={isLoading} error={error} />
      </TabsContent>
      
      <TabsContent value="successful">
        <PaymentsTable payments={successfulPayments} isLoading={isLoading} error={error} />
      </TabsContent>
      
      <TabsContent value="pending">
        <PaymentsTable payments={pendingPayments} isLoading={isLoading} error={error} />
      </TabsContent>
      
      <TabsContent value="failed">
        <PaymentsTable payments={failedPayments} isLoading={isLoading} error={error} />
      </TabsContent>
    </Tabs>
  );
}
