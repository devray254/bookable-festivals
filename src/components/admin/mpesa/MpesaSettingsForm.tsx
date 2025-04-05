
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, TestTube2 } from "lucide-react";
import { updateMpesaSettings, type MpesaSettings } from "@/utils/mpesa-settings";
import { mpesaFormSchema, type MpesaFormValues } from "./MpesaSettingsSchema";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="consumer_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumer Key</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type={showSecrets ? "text" : "password"} 
                    placeholder="Enter your M-Pesa Consumer Key" 
                  />
                </FormControl>
                <FormDescription>
                  The Consumer Key from your Safaricom Developer account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consumer_secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumer Secret</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type={showSecrets ? "text" : "password"} 
                    placeholder="Enter your M-Pesa Consumer Secret" 
                  />
                </FormControl>
                <FormDescription>
                  The Consumer Secret from your Safaricom Developer account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passkey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passkey</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type={showSecrets ? "text" : "password"} 
                    placeholder="Enter your M-Pesa Passkey" 
                  />
                </FormControl>
                <FormDescription>
                  The Passkey for STK Push requests
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shortcode</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter your M-Pesa Shortcode" 
                  />
                </FormControl>
                <FormDescription>
                  Your M-Pesa Paybill or Till Number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose Sandbox for testing, Production for live payments
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="callback_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Callback URL</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://yourdomain.com/api/mpesa-callback.php" 
                  />
                </FormControl>
                <FormDescription>
                  URL where M-Pesa will send payment notifications.
                  Must be a public HTTPS URL that Safaricom can reach.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="text-sm font-medium mb-2">About the Callback URL</h3>
          <p className="text-xs text-muted-foreground">
            The callback URL must be a publicly accessible HTTPS endpoint. For production use, this should be your domain with the path to the mpesa-callback.php file. For testing, you can use a service like Ngrok to create a temporary public URL for your local environment.
          </p>
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
      </form>
    </Form>
  );
}
