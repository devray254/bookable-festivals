
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface PaymentStepProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  totalAmount: number;
  processingFee: number;
  grandTotal: number;
  ticketQuantity: number;
  eventPrice: number;
  isProcessing: boolean;
  onCancel: () => void;
  onInitiatePayment: () => void;
}

const PaymentStep = ({
  phoneNumber,
  setPhoneNumber,
  totalAmount,
  processingFee,
  grandTotal,
  ticketQuantity,
  eventPrice,
  isProcessing,
  onCancel,
  onInitiatePayment,
}: PaymentStepProps) => {
  return (
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="bg-eventPurple-700 hover:bg-eventPurple-800"
          onClick={onInitiatePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay with M-Pesa"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default PaymentStep;
