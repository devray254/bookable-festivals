
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

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
  
  const totalAmount = eventPrice * ticketQuantity;
  
  const handlePayment = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call to M-Pesa
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully initiated M-Pesa payment request to ${phoneNumber}. You'll receive a prompt on your phone to complete the payment.`);
      onOpenChange(false);
    }, 2000);
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
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm font-medium col-span-1">
              M-Pesa Number
            </label>
            <Input
              id="phone"
              placeholder="07XXXXXXXX"
              className="col-span-3"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Ticket Price</span>
              <span>KES {eventPrice.toLocaleString()} x {ticketQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Processing Fee</span>
              <span>KES 50</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>KES {(totalAmount + 50).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-eventPurple-700 hover:bg-eventPurple-800"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay with M-Pesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
