
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { updateMpesaSettings, type MpesaSettings } from "@/utils/mpesa-settings";
import { mpesaFormSchema, type MpesaFormValues } from "./MpesaSettingsSchema";
import { FormSensitiveFields } from "./FormSensitiveFields";
import { FormGeneralFields } from "./FormGeneralFields";
import { FormActions } from "./FormActions";
import { FormInfoSection } from "./FormInfoSection";

interface MpesaSettingsFormProps {
  initialData: MpesaSettings | null;
}

// Generate default callback URL based on current domain
const getDefaultCallbackUrl = () => {
  if (typeof window !== 'undefined') {
    // Get the base URL (protocol + domain)
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/mpesa-callback.php`;
  }
  return 'https://example.com/callback';
};

// Sandbox test credentials
const TEST_CREDENTIALS: MpesaFormValues = {
  consumer_key: "2sh7EgkM79EYKcAYsGZ9OAZlxgzXvDrG",
  consumer_secret: "F7jG9MnI3FppN8lY",
  passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  shortcode: "174379",
  environment: "sandbox",
  callback_url: getDefaultCallbackUrl()
};

export function MpesaSettingsForm({ initialData }: MpesaSettingsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  const form = useForm<MpesaFormValues>({
    resolver: zodResolver(mpesaFormSchema),
    defaultValues: {
      consumer_key: initialData?.consumer_key || "",
      consumer_secret: initialData?.consumer_secret || "",
      passkey: initialData?.passkey || "",
      shortcode: initialData?.shortcode || "",
      environment: initialData?.environment || "sandbox",
      callback_url: initialData?.callback_url || getDefaultCallbackUrl()
    }
  });

  const onSubmit = async (data: MpesaFormValues) => {
    setIsLoading(true);
    try {
      // Since we've validated with zod, we can safely cast this as MpesaSettings
      const settingsData: MpesaSettings = {
        consumer_key: data.consumer_key,
        consumer_secret: data.consumer_secret,
        passkey: data.passkey,
        shortcode: data.shortcode,
        environment: data.environment,
        callback_url: data.callback_url
      };
      
      await updateMpesaSettings(settingsData);
      toast({
        title: "Success",
        description: "M-Pesa settings updated successfully"
      });
    } catch (error) {
      console.error("Error updating M-Pesa settings:", error);
      toast({
        title: "Error",
        description: "Failed to update M-Pesa settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyTestCredentials = () => {
    form.reset(TEST_CREDENTIALS);
    toast({
      title: "Test Credentials Applied",
      description: "Sandbox test credentials have been applied. Don't forget to save!"
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormActions 
          isLoading={isLoading}
          showSecrets={showSecrets}
          setShowSecrets={setShowSecrets}
          applyTestCredentials={applyTestCredentials}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSensitiveFields form={form} showSecrets={showSecrets} />
          <FormGeneralFields form={form} />
        </div>

        <FormInfoSection />
        
        <FormActions 
          isLoading={isLoading}
          showSecrets={showSecrets}
          setShowSecrets={setShowSecrets}
          applyTestCredentials={applyTestCredentials}
        />
      </form>
    </Form>
  );
}
