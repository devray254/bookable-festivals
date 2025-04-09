
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CpdFieldsProps {
  form: UseFormReturn<any>;
}

export function CpdFields({ form }: CpdFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="cpd_points"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPD Points</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : parseInt(value, 10));
                }}
              />
            </FormControl>
            <FormDescription>
              Number of CPD points attendees will receive
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="target_audience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Physicians, Nurses, Pharmacists" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
