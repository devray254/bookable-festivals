
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CategoryForm, CategoryFormData } from "./CategoryForm";

interface CategoryDialogProps {
  isOpen: boolean;
  isEditMode: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  defaultValues: CategoryFormData;
}

export function CategoryDialog({
  isOpen,
  isEditMode,
  onOpenChange,
  onSubmit,
  defaultValues
}: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update category details" : "Create a new category for organizing events"}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitLabel={isEditMode ? "Update Category" : "Create Category"}
        />
      </DialogContent>
    </Dialog>
  );
}
