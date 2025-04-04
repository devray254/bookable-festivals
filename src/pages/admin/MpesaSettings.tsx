
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { getMpesaSettings, updateMpesaSettings } from "@/utils/mpesa-settings";

// Define the form schema with Zod
const mpesaFormSchema = z.object({
  consumer_key: z.string().min(1, "Consumer Key is required"),
  consumer_secret: z.string().min(1, "Consumer Secret is required"),
  passkey: z.string().min(1, "Passkey is required"),
  shortcode: z.string().min(1, "Shortcode is required").regex(/^\d+$/, "Shortcode must contain only numbers"),
  environment: z.enum(["sandbox", "production"]),
  callback_url: z.string().url("Please enter a valid URL")
});

type MpesaFormValues = z.infer<typeof mpesaFormSchema>;

export default function MpesaSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  const form = useForm<MpesaFormValues>({
    resolver: zodResolver(mpesaFormSchema),
    defaultValues: {
      consumer_key: "",
      consumer_secret: "",
      passkey: "",
      shortcode: "",
      environment: "sandbox",
      callback_url: "https://example.com/callback"
    }
  });

  // Load existing settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getMpesaSettings();
        if (settings) {
          form.reset(settings);
        }
      } catch (error) {
        console.error("Error loading M-Pesa settings:", error);
        toast({
          title: "Error",
          description: "Failed to load M-Pesa settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form, toast]);

  const onSubmit = async (data: MpesaFormValues) => {
    setIsLoading(true);
    try {
      await updateMpesaSettings(data);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">M-Pesa Settings</h1>
          <p className="text-muted-foreground">Configure your M-Pesa integration settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>M-Pesa API Configuration</CardTitle>
            <CardDescription>
              Enter your Safaricom M-Pesa API credentials for payment processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Switch
                    checked={showSecrets}
                    onCheckedChange={setShowSecrets}
                    id="show-secrets"
                  />
                  <label htmlFor="show-secrets" className="text-sm font-medium">
                    Show sensitive information
                  </label>
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
                          URL where M-Pesa will send payment notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-sm text-muted-foreground">
              Note: These settings will be used for all M-Pesa transactions. Make sure your credentials are correct.
            </p>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
