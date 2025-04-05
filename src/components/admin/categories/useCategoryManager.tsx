
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/utils/database";

export interface CategoryFormData {
  name: string;
  description: string;
}

export function useCategoryManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get admin email from localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const adminEmail = user?.email || 'admin@example.com';

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchCategories();
      setCategories(result);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEditCategory = useCallback((category: any) => {
    setIsEditMode(true);
    setCurrentCategoryId(category.id);
    setIsDialogOpen(true);
  }, []);

  const handleAddNewCategory = useCallback(() => {
    setIsEditMode(false);
    setCurrentCategoryId(null);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteCategory = useCallback(async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteCategory(categoryToDelete.id, adminEmail);
      
      if (result.success) {
        toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
        loadCategories(); // Reload categories
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting the category");
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  }, [categoryToDelete, adminEmail, loadCategories]);

  const formDefaultValues = {
    name: "",
    description: ""
  };

  const getFormValues = useCallback(() => {
    if (isEditMode && currentCategoryId) {
      const category = categories.find(c => c.id === currentCategoryId);
      return {
        name: category?.name || "",
        description: category?.description || ""
      };
    }
    return formDefaultValues;
  }, [isEditMode, currentCategoryId, categories, formDefaultValues]);

  const handleSubmit = useCallback(async (data: CategoryFormData) => {
    try {
      let result;
      
      if (isEditMode && currentCategoryId) {
        // Update existing category
        result = await updateCategory(currentCategoryId, data, adminEmail);
        if (result.success) {
          toast.success(`Category "${data.name}" updated successfully`);
        } else {
          toast.error(result.message || "Failed to update category");
        }
      } else {
        // Create new category
        result = await createCategory(data, adminEmail);
        if (result.success) {
          toast.success(`Category "${data.name}" created successfully`);
        } else {
          toast.error(result.message || "Failed to create category");
        }
      }
      
      if (result.success) {
        setIsDialogOpen(false);
        loadCategories(); // Reload categories
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred while saving the category");
    }
  }, [isEditMode, currentCategoryId, adminEmail, loadCategories]);

  return {
    isLoading,
    categories,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    currentCategoryId,
    categoryToDelete,
    setCategoryToDelete,
    isDeleting,
    handleEditCategory,
    handleAddNewCategory,
    handleDeleteCategory,
    handleSubmit,
    getFormValues
  };
}
