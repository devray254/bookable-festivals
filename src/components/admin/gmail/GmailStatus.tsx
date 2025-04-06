
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface GmailSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  enabled: boolean;
}

interface GmailStatusProps {
  isLoading: boolean;
  gmailSettings?: GmailSettings;
}

export function GmailStatus({ isLoading, gmailSettings }: GmailStatusProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-6 w-6 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const isConfigured = gmailSettings?.client_id && gmailSettings?.client_secret;
  const isEnabled = gmailSettings?.enabled;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium">Gmail Integration Status</div>
        <Badge variant={isEnabled ? "default" : "outline"}>
          {isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      
      {!isConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Configured</AlertTitle>
          <AlertDescription>
            Gmail integration is not configured. Please provide the required credentials below.
          </AlertDescription>
        </Alert>
      )}
      
      {isConfigured && isEnabled && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Gmail Integration Active</AlertTitle>
          <AlertDescription>
            Gmail integration is properly configured and activated. Users can sign in with Gmail and certificates can be emailed.
          </AlertDescription>
        </Alert>
      )}
      
      {isConfigured && !isEnabled && (
        <Alert variant="default" className="bg-orange-50 border-orange-200 text-orange-800">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle>Gmail Integration Inactive</AlertTitle>
          <AlertDescription>
            Gmail integration is configured but not enabled. Enable it to allow users to sign in with Gmail and send certificate emails.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
