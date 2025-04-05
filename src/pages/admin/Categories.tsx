
import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Dialog } from "@/components/ui/dialog";

import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryActions } from "@/components/admin/categories/CategoryActions";
import { CategoryDialog } from "@/components/admin/categories/CategoryDialog";
import { DeleteCategoryDialog } from "@/components/admin/categories/DeleteCategoryDialog";
import { useCategoryManager } from "@/components/admin/categories/useCategoryManager";

export default function AdminCategories() {
  const {
    isLoading,
    categories,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    categoryToDelete,
    setCategoryToDelete,
    isDeleting,
    handleEditCategory,
    handleAddNewCategory,
    handleDeleteCategory,
    handleSubmit,
    getFormValues
  } = useCategoryManager();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <CategoryActions onAddNewCategory={handleAddNewCategory} />
          
          <CategoryDialog
            isOpen={isDialogOpen}
            isEditMode={isEditMode}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            defaultValues={getFormValues()}
          />
        </Dialog>
        
        <div className="grid gap-4 md:grid-cols-1">
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            onEditCategory={handleEditCategory}
            onDeleteCategory={setCategoryToDelete}
          />
        </div>
      </div>

      <DeleteCategoryDialog
        category={categoryToDelete}
        isOpen={!!categoryToDelete}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        onDelete={handleDeleteCategory}
      />
    </AdminLayout>
  );
}
