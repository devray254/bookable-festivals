
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface SocialLoginDividerProps {
  onGmailLogin: () => void;
  isGmailEnabled: boolean;
  isGmailLoading: boolean;
  isLoginLoading: boolean;
}

export const SocialLoginDivider = ({
  onGmailLogin,
  isGmailEnabled,
  isGmailLoading,
  isLoginLoading
}: SocialLoginDividerProps) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-700 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:border-blue-500 transition-all font-medium"
          onClick={onGmailLogin}
          disabled={isGmailLoading || isLoginLoading || !isGmailEnabled}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isGmailLoading ? "Signing in..." : "Sign in with Gmail"}
        </Button>
      </div>
    </div>
  );
};
