
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface DataTableColumn<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading = false, 
  emptyMessage = "No data found", 
  loadingMessage = "Loading data..."
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>{loadingMessage}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.cell 
                    ? column.cell(row)
                    : typeof column.accessorKey === 'function'
                      ? column.accessorKey(row)
                      : String(row[column.accessorKey] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
