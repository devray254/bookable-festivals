
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { GmailSettings } from "@/utils/gmail-settings";

export interface GmailStatusProps {
  settings: GmailSettings;
}

const GmailStatus = ({ settings }: GmailStatusProps) => {
  const isConnected = settings.is_connected;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">Connection Status:</div>
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-500">Connected</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-amber-500">Not Connected</span>
            </>
          )}
        </div>
      </div>
      
      {isConnected && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1">Account:</div>
            <div className="font-medium">{settings.certificate_sender_email || 'Not set'}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1">Token Expires:</div>
            <div className="font-medium">
              {settings.token_expiry 
                ? new Date(settings.token_expiry).toLocaleString() 
                : 'Unknown'}
            </div>
          </div>
        </>
      )}
      
      <div className="pt-4">
        {isConnected ? (
          <Button variant="destructive" className="w-full">
            Disconnect Gmail
          </Button>
        ) : (
          <Button className="w-full" disabled={!settings.client_id || !settings.client_secret}>
            Connect to Gmail
          </Button>
        )}
      </div>
    </div>
  );
};

export default GmailStatus;
