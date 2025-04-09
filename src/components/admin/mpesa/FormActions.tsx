
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TestTube2, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type MpesaFormValues } from "./MpesaSettingsSchema";

interface FormActionsProps {
  isLoading: boolean;
  showSecrets: boolean;
  setShowSecrets: (show: boolean) => void;
  applyTestCredentials: () => void;
}

export function FormActions({ 
  isLoading, 
  showSecrets, 
  setShowSecrets, 
  applyTestCredentials 
}: FormActionsProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            checked={showSecrets}
            onCheckedChange={setShowSecrets}
            id="show-secrets"
          />
          <label htmlFor="show-secrets" className="text-sm font-medium">
            Show sensitive information
          </label>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={applyTestCredentials}
          className="flex items-center gap-2"
        >
          <TestTube2 className="h-4 w-4" />
          Apply Test Credentials
        </Button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </>
  );
}
