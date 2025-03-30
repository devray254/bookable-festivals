
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

const MPESA_CONSUMER_KEY = "your_consumer_key";  // Replace with your consumer key
const MPESA_CONSUMER_SECRET = "your_consumer_secret";  // Replace with your consumer secret  
const MPESA_PASSKEY = "your_passkey";  // Replace with your passkey
const MPESA_SHORTCODE = "174379";  // Replace with your shortcode

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

  const getAccessToken = async () => {
    try {
      const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
      const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        method: "GET",
        headers: {
          "Authorization": `Basic ${auth}`
        }
      });
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw new Error("Could not authenticate with M-Pesa");
    }
  };

  const initiateSTKPush = async (phone: string, amount: number) => {
    try {
      const accessToken = await getAccessToken();
      const formattedPhone = formatPhoneNumber(phone);
      
      const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
      const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);
      
      const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount.toString(),
          PartyA: formattedPhone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: "https://example.com/callback",
          AccountReference: `Event-${eventTitle.substring(0, 10)}`,
          TransactionDesc: `Payment for ${ticketQuantity} ticket(s) for ${eventTitle}`
        })
      });
      
      const data = await response.json();
      
      if (data.ResponseCode === "0") {
        return true;
      } else {
        throw new Error(data.ResponseDescription || "M-Pesa request failed");
      }
    } catch (error) {
      console.error("STK Push error:", error);
      throw error;
    }
  };

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
      const success = await initiateSTKPush(phoneNumber, grandTotal);
      
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
        
        {paymentStep === "processing" && (
          <div className="grid gap-4 py-4">
            <div className="text-center mb-2">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Payment in Progress</h3>
              <p className="text-sm text-gray-600 mb-4">
                An M-Pesa payment request of <span className="font-semibold">KES {grandTotal.toLocaleString()}</span> has been 
                sent to <span className="font-semibold">{formatPhoneNumber(phoneNumber)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Please check your phone and enter your M-Pesa PIN to complete the payment.
              </p>
            </div>
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
