
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { validatePhoneNumber } from "@/utils/phone";
import { initiateSTKPush } from "@/utils/mpesa";
import PaymentStep from "./booking/PaymentStep";
import ProcessingStep from "./booking/ProcessingStep";
import ConfirmationStep from "./booking/ConfirmationStep";

interface BookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticketQuantity: number;
  eventTitle: string;
  eventPrice: number;
}

const BookingDialog = ({ 
  isOpen, 
  onOpenChange, 
  ticketQuantity, 
  eventTitle,
  eventPrice 
}: BookingDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "processing" | "confirmation">("details");
  const { toast } = useToast();
  
  // Calculate the booking amounts
  const totalAmount = eventPrice * ticketQuantity;
  const serviceFeePercent = 20;
  const serviceFee = Math.round(totalAmount * (serviceFeePercent / 100));
  const grandTotal = totalAmount + serviceFee;

  const handleInitiatePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-Pesa phone number (e.g., 07XXXXXXXX)",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setPaymentStep("processing");
    
    try {
      const success = await initiateSTKPush(phoneNumber, grandTotal, eventTitle, ticketQuantity);
      
      if (success) {
        toast({
          title: "M-Pesa Request Sent",
          description: "Please check your phone and enter your M-Pesa PIN to complete the payment.",
        });
        
        // After a short delay, show the confirmation screen
        // In a real app, you would verify the transaction status with the M-Pesa Query API
        setTimeout(() => {
          setPaymentStep("confirmation");
          setIsProcessing(false);
        }, 5000);
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to initiate M-Pesa payment",
        variant: "destructive",
      });
      setPaymentStep("details");
      setIsProcessing(false);
    }
  };

  const handleCloseDialog = () => {
    setPaymentStep("details");
    setPhoneNumber("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            You're booking {ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''} for {eventTitle}
          </DialogDescription>
        </DialogHeader>
        
        {paymentStep === "details" && (
          <PaymentStep 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            totalAmount={totalAmount}
            serviceFee={serviceFee}
            serviceFeePercent={serviceFeePercent}
            grandTotal={grandTotal}
            ticketQuantity={ticketQuantity}
            eventPrice={eventPrice}
            isProcessing={isProcessing}
            onCancel={() => onOpenChange(false)}
            onInitiatePayment={handleInitiatePayment}
          />
        )}
        
        {paymentStep === "processing" && (
          <ProcessingStep 
            phoneNumber={phoneNumber}
            grandTotal={grandTotal}
          />
        )}
        
        {paymentStep === "confirmation" && (
          <ConfirmationStep 
            grandTotal={grandTotal}
            onClose={handleCloseDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
