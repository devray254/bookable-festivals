
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";

interface GmailAuthSettingsProps {
  isEnabled?: boolean;
}

interface AuthSettings {
  enableSignup: boolean;
  enableLogin: boolean;
  redirectAfterLogin: string;
  welcomeMessage: string;
}

export function GmailAuthSettings({ isEnabled }: GmailAuthSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AuthSettings>({
    defaultValues: {
      enableSignup: true,
      enableLogin: true,
      redirectAfterLogin: '/dashboard',
      welcomeMessage: 'Welcome to Maabara Online! Your account has been created successfully.'
    }
  });
  
  const watchEnableSignup = watch("enableSignup");
  const watchEnableLogin = watch("enableLogin");
  
  const onSubmit = async (data: AuthSettings) => {
    if (!isEnabled) {
      toast.error("Gmail integration must be enabled first");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API to save the settings
      console.log("Saving auth settings:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Authentication settings saved successfully");
    } catch (error) {
      console.error("Error saving auth settings:", error);
      toast.error("Failed to save authentication settings");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isEnabled) {
    return (
      <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Gmail integration not enabled</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                You need to enable Gmail integration in the settings above before configuring
                authentication options.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 p-4 border rounded-md">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableSignup"
              checked={watchEnableSignup}
              onCheckedChange={(checked) => setValue("enableSignup", checked)}
            />
            <Label htmlFor="enableSignup">Enable Sign Up with Gmail</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="enableLogin"
              checked={watchEnableLogin}
              onCheckedChange={(checked) => setValue("enableLogin", checked)}
            />
            <Label htmlFor="enableLogin">Enable Sign In with Gmail</Label>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="redirectAfterLogin">Redirect After Login</Label>
          <Input
            id="redirectAfterLogin"
            {...register("redirectAfterLogin", { required: "Redirect path is required" })}
            placeholder="/dashboard"
          />
          {errors.redirectAfterLogin && (
            <p className="text-sm text-red-500">{errors.redirectAfterLogin.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Textarea
            id="welcomeMessage"
            {...register("welcomeMessage")}
            placeholder="Welcome message for new users"
            rows={3}
          />
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
            Save Auth Settings
          </>
        )}
      </Button>
    </form>
  );
}
