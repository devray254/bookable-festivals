
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface EventLocationProps {
  form: UseFormReturn<any>;
}

export function EventLocation({ form }: EventLocationProps) {
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
