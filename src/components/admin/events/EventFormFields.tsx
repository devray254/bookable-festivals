
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/utils/categories";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface EventFormFieldsProps {
  form: UseFormReturn<any>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  // Watch the price type to conditionally show price field
  const priceType = form.watch("priceType") || "paid";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Fetch categories from database
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        console.log('Categories loaded in form:', categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load categories");
        // Use fallback categories if fetch fails
        setCategories([
          { id: 1, name: 'Workshop' },
          { id: 2, name: 'Seminar' },
          { id: 3, name: 'Conference' },
          { id: 4, name: 'Exhibition' },
          { id: 5, name: 'Hackathon' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category<span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {loadingCategories ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Loading categories...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a category" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter event description" 
                className="resize-none min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
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
      
      <FormField
        control={form.control}
        name="priceType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Event Price Type<span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value || "paid"}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Paid Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free">Free Event</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {priceType === "paid" && (
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (KES)<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* New CPD Points Field */}
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
    </>
  );
}
