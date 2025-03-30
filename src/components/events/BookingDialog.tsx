
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
  const [paymentStep, setPaymentStep] = useState<"details" | "otp" | "confirmation">("details");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  
  const totalAmount = eventPrice * ticketQuantity;
  const processingFee = 50;
  const grandTotal = totalAmount + processingFee;
  
  const validatePhoneNumber = (phone: string) => {
    // Basic Kenyan phone number validation (Safaricom)
    // Accepts formats: 07XXXXXXXX, 7XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
    const regex = /^(?:(?:\+|)254|0)?7[0-9]{8}$/;
    return regex.test(phone);
  };

  const formatPhoneNumber = (phone: string) => {
    let formatted = phone;
    
    // Strip any non-digit characters
    formatted = formatted.replace(/\D/g, '');
    
    // If it's a 9-digit number starting with 7, prefix with 254
    if (/^7\d{8}$/.test(formatted)) {
      formatted = `254${formatted}`;
    }
    
    // If it's a 10-digit number starting with 07, convert to 2547...
    if (/^07\d{8}$/.test(formatted)) {
      formatted = `254${formatted.substring(1)}`;
    }
    
    return formatted;
  };

  const handleInitiatePayment = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-Pesa phone number (e.g., 07XXXXXXXX)",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call to initiate M-Pesa STK push
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep("otp");
      
      toast({
        title: "M-Pesa Request Sent",
        description: "Please check your phone for the M-Pesa prompt and enter the OTP below.",
      });
    }, 2000);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP sent to your phone",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call to verify OTP and complete payment
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep("confirmation");
      
      toast({
        title: "Payment Successful!",
        description: `Your payment of KES ${grandTotal.toLocaleString()} has been processed successfully.`,
      });
    }, 2000);
  };

  const handleCloseDialog = () => {
    setPaymentStep("details");
    setPhoneNumber("");
    setOtp("");
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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="07XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500">Enter the phone number registered with M-Pesa</p>
            </div>
            
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ticket Price</span>
                <span>KES {eventPrice.toLocaleString()} x {ticketQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>KES {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing Fee</span>
                <span>KES {processingFee}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>KES {grandTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-eventPurple-700 hover:bg-eventPurple-800"
                onClick={handleInitiatePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay with M-Pesa"}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {paymentStep === "otp" && (
          <div className="grid gap-4 py-4">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600 mb-4">
                A payment request of <span className="font-semibold">KES {grandTotal.toLocaleString()}</span> has been 
                sent to <span className="font-semibold">{formatPhoneNumber(phoneNumber)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Please enter the OTP received on your phone:
              </p>
            </div>
            
            <div className="flex justify-center py-4">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setPaymentStep("details")}>
                Back
              </Button>
              <Button 
                className="bg-eventPurple-700 hover:bg-eventPurple-800"
                onClick={handleVerifyOtp}
                disabled={isProcessing || otp.length !== 6}
              >
                {isProcessing ? "Verifying..." : "Verify Payment"}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {paymentStep === "confirmation" && (
          <div className="grid gap-4 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Payment Successful!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your payment of <span className="font-semibold">KES {grandTotal.toLocaleString()}</span> has been processed successfully.
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Transaction Reference: MP{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
                onClick={handleCloseDialog}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
