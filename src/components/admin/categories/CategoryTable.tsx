
import React from "react";
import { Edit, Trash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/ui/DataTable";

interface CategoryTableProps {
  categories: any[];
  isLoading: boolean;
  onEditCategory: (category: any) => void;
  onDeleteCategory: (category: any) => void;
}

export function CategoryTable({
  categories,
  isLoading,
  onEditCategory,
  onDeleteCategory
}: CategoryTableProps) {
  const columns = [
    {
      header: "Name",
      accessorKey: (row: any) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: "Description",
      accessorKey: (row: any) => row.description || "No description",
    },
    {
      header: "Events",
      accessorKey: (row: any) => row.events_count || 0,
    },
    {
      header: "Actions",
      accessorKey: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEditCategory(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDeleteCategory(row)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
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
          <DataTable 
            data={categories} 
            columns={columns} 
            emptyMessage="No categories found. Create your first category to get started."
          />
        )}
      </CardContent>
    </Card>
  );
}
