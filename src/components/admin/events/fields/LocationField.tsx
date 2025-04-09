
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationFieldProps {
  form: UseFormReturn<any>;
}

export function LocationField({ form }: LocationFieldProps) {
  const locationTypeValue = form.watch("locationType") || "physical";

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="locationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Type<span className="text-red-500">*</span></FormLabel>
            <Select
              value={field.value || "physical"}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">Physical Venue</SelectItem>
                <SelectItem value="online">Online/Virtual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {locationTypeValue === "physical" 
                ? "Venue Location" 
                : locationTypeValue === "online" 
                  ? "Meeting Link"
                  : "Primary Location"}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder={
                  locationTypeValue === "physical" 
                    ? "Enter venue address" 
                    : locationTypeValue === "online" 
                      ? "Enter meeting URL"
                      : "Enter primary location"
                }
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {locationTypeValue === "hybrid" && (
        <FormField
          control={form.control}
          name="onlineLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Online Access Link<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter meeting URL for remote participants" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
