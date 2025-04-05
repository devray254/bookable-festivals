
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface CategoryActionsProps {
  onAddNewCategory: () => void;
}

export function CategoryActions({ onAddNewCategory }: CategoryActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage event categories</p>
      </div>
      <DialogTrigger asChild>
        <Button onClick={onAddNewCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
    </div>
  );
}
