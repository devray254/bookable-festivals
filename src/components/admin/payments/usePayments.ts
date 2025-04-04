
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments, Payment } from "@/utils/payments";
import { UIPayment } from "./types";

export function usePayments() {
  const { data: rawPayments = [], isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments
  });

  const [payments, setPayments] = useState<UIPayment[]>([]);

  useEffect(() => {
    if (rawPayments.length > 0) {
      const transformedPayments = rawPayments.map(payment => ({
        id: payment.transaction_id,
        booking_id: payment.booking_id,
        event: payment.event_title || "Unknown Event",
        customer: payment.user_name || "Unknown User",
        phone: "07" + Math.floor(10000000 + Math.random() * 90000000), // Mock phone number
        amount: payment.amount.toString(),
        date: payment.created_at,
        method: payment.payment_method,
        status: payment.status === "completed" ? "successful" : payment.status
      }));
      setPayments(transformedPayments);
    }
  }, [rawPayments]);

  // Filter payments by status
  const successfulPayments = payments.filter(payment => payment.status === "successful");
  const pendingPayments = payments.filter(payment => payment.status === "pending");
  const failedPayments = payments.filter(payment => payment.status === "failed");

  // Calculate total revenue
  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return {
    payments,
    successfulPayments,
    pendingPayments,
    failedPayments,
    totalRevenue,
    isLoading,
    error
  };
}
