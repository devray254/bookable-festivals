
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ConfirmationStepProps {
  grandTotal: number;
  onClose: () => void;
}

const ConfirmationStep = ({ grandTotal, onClose }: ConfirmationStepProps) => {
  return (
    <div className="py-6 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
      
      <p className="text-gray-600 mb-6">
        Your payment of <span className="font-medium">KES {grandTotal.toLocaleString()}</span> has been received. You will receive a confirmation email shortly.
      </p>
      
      <Button onClick={onClose} className="w-full">
        Done
      </Button>
    </div>
  );
};

export default ConfirmationStep;
