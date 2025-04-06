
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { updateGmailSettings } from "@/utils/gmail-settings";

interface GmailSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  enabled: boolean;
}

interface GmailSettingsFormProps {
  existingSettings?: Partial<GmailSettings>;
  onSuccess: () => void;
}

export function GmailSettingsForm({ existingSettings, onSuccess }: GmailSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<GmailSettings>({
    defaultValues: {
      clientId: existingSettings?.clientId || '',
      clientSecret: existingSettings?.clientSecret || '',
      redirectUri: existingSettings?.redirectUri || window.location.origin + '/auth/callback',
      enabled: existingSettings?.enabled || false
    }
  });
  
  const watchEnabled = watch("enabled");
  
  const onSubmit = async (data: GmailSettings) => {
    setIsSubmitting(true);
    try {
      const result = await updateGmailSettings(data, 'admin@maabara.co.ke'); 
      
      if (result.success) {
        toast.success("Gmail settings saved successfully");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to save Gmail settings");
      }
    } catch (error) {
      console.error("Error saving Gmail settings:", error);
      toast.error("An error occurred while saving Gmail settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            {...register("clientId", { required: "Client ID is required" })}
            placeholder="Your Gmail OAuth Client ID"
          />
          {errors.clientId && (
            <p className="text-sm text-red-500">{errors.clientId.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <Input
            id="clientSecret"
            type="password"
            {...register("clientSecret", { required: "Client Secret is required" })}
            placeholder="Your Gmail OAuth Client Secret"
          />
          {errors.clientSecret && (
            <p className="text-sm text-red-500">{errors.clientSecret.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="redirectUri">Redirect URI</Label>
          <Input
            id="redirectUri"
            {...register("redirectUri", { required: "Redirect URI is required" })}
          />
          {errors.redirectUri && (
            <p className="text-sm text-red-500">{errors.redirectUri.message}</p>
          )}
          <p className="text-sm text-muted-foreground">
            This should match the redirect URI configured in your Google Cloud Console
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={watchEnabled}
            onCheckedChange={(checked) => setValue("enabled", checked)}
          />
          <Label htmlFor="enabled">Enable Gmail Authentication</Label>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </form>
  );
}
