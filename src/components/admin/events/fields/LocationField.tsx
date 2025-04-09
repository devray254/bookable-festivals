
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface LocationFieldProps {
  form: UseFormReturn<any>;
}

export function LocationField({ form }: LocationFieldProps) {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location<span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Enter venue" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
