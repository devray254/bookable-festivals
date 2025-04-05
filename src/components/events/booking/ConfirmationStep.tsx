
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface ConfirmationStepProps {
  grandTotal: number;
  onClose: () => void;
}

const ConfirmationStep = ({ grandTotal, onClose }: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const transactionRef = `MP${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  useEffect(() => {
    // Set a short timeout before redirecting to profile
    // This gives the user time to see the confirmation message
    const redirectTimer = setTimeout(() => {
      navigate('/profile');
    }, 3000);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  return (
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
          Transaction Reference: {transactionRef}
        </p>
        <p className="text-xs text-gray-500">
          A confirmation email has been sent to your registered email address.
        </p>
        <p className="text-sm mt-4 text-eventPurple-700">
          Redirecting to your profile in a moment...
        </p>
      </div>
      
      <DialogFooter className="mt-4">
        <Button 
          className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
          onClick={() => navigate('/profile')}
        >
          Go to Profile
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ConfirmationStep;
