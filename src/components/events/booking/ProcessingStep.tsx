
import React from "react";

interface ProcessingStepProps {
  phoneNumber: string;
  grandTotal: number;
}

const ProcessingStep = ({ phoneNumber, grandTotal }: ProcessingStepProps) => {
  return (
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
          sent to <span className="font-semibold">{phoneNumber}</span>
        </p>
        <p className="text-sm text-gray-600">
          Please check your phone and enter your M-Pesa PIN to complete the payment.
        </p>
      </div>
    </div>
  );
};

export default ProcessingStep;
