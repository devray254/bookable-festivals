
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchCategories } from "@/utils/categories";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CategorySelectProps {
  field: {
    onChange: (value: string) => void;
    value: string;
  };
}

export function CategorySelect({ field }: CategorySelectProps) {
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
    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
