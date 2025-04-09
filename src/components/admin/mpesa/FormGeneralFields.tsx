
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { type MpesaFormValues } from "./MpesaSettingsSchema";

interface FormGeneralFieldsProps {
  form: UseFormReturn<MpesaFormValues>;
}

export function FormGeneralFields({ form }: FormGeneralFieldsProps) {
  return (
    <>
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
    </>
  );
}
