
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ConfirmationStepProps {
  grandTotal: number;
  onClose: () => void;
  eventId?: number;
}

const ConfirmationStep = ({ grandTotal, onClose, eventId }: ConfirmationStepProps) => {
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
      
      <div className="space-y-3">
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
        
        {eventId && (
          <Link to={`/events/${eventId}`}>
            <Button variant="outline" className="w-full mt-2">
              Return to Event
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;
