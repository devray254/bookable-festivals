
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { type MpesaFormValues } from "./MpesaSettingsSchema";

interface FormSensitiveFieldsProps {
  form: UseFormReturn<MpesaFormValues>;
  showSecrets: boolean;
}

export function FormSensitiveFields({ form, showSecrets }: FormSensitiveFieldsProps) {
  return (
    <>
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
    </>
  );
}
