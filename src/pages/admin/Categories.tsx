
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/utils/categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface CategoryFormData {
  name: string;
  description: string;
}

export default function AdminCategories() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  // Get admin email from localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const adminEmail = user?.email || 'admin@example.com';

  // Fetch categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
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
  };

  const onSubmit = async (data: CategoryFormData) => {
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
        form.reset();
        loadCategories(); // Reload categories
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred while saving the category");
    }
  };

  const handleEditCategory = (category: any) => {
    setIsEditMode(true);
    setCurrentCategoryId(category.id);
    form.reset({
      name: category.name,
      description: category.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleAddNewCategory = () => {
    setIsEditMode(false);
    setCurrentCategoryId(null);
    form.reset({
      name: "",
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
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
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage event categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNewCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Update category details" : "Create a new category for organizing events"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Category name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter category description" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">{isEditMode ? "Update Category" : "Create Category"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Events</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            No categories found. Create your first category to get started.
                          </td>
                        </tr>
                      ) : (
                        categories.map((category) => (
                          <tr key={category.id} className="border-b">
                            <td className="p-2 font-medium">{category.name}</td>
                            <td className="p-2">{category.description || 'No description'}</td>
                            <td className="p-2">{category.events || 0}</td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setCategoryToDelete(category)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!categoryToDelete} 
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category 
              <span className="font-semibold"> "{categoryToDelete?.name}"</span>.
              {categoryToDelete?.events > 0 && (
                <span className="text-red-500 block mt-2">
                  Warning: This category is used by {categoryToDelete.events} events.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCategory();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
