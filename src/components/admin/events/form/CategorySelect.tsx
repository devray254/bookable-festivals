
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";
import { fetchCategories } from "@/utils/categories";

interface CategorySelectProps {
  field: ControllerRenderProps<any, "category">;
}

interface Category {
  id: number;
  name: string;
}

export function CategorySelect({ field }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value}
      value={field.value}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
        ) : categories.length > 0 ? (
          categories.map(category => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>No categories available</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
