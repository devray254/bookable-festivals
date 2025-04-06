
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PaymentStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  totalAmount: number;
  serviceFee: number;
  serviceFeePercent: number;
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
  serviceFee,
  serviceFeePercent,
  grandTotal,
  ticketQuantity,
  eventPrice,
  isProcessing,
  onCancel,
  onInitiatePayment
}: PaymentStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            M-Pesa Phone Number
          </label>
          <Input
            id="phoneNumber"
            placeholder="Enter your M-Pesa number e.g. 07xxxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500">
            You will receive an M-Pesa prompt on this number to complete payment
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Ticket price</span>
          <span>KES {eventPrice.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Quantity</span>
          <span>{ticketQuantity}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>KES {totalAmount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Service fee ({serviceFeePercent}%)</span>
          <span>KES {serviceFee.toLocaleString()}</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>KES {grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={onInitiatePayment}
          disabled={!phoneNumber || isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay with M-Pesa"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
