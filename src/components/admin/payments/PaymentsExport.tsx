
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { exportPaymentsToExcel, exportPaymentsToPDF } from "@/utils/payments/exports";
import { UIPayment } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface PaymentsExportProps {
  payments: UIPayment[];
}

export function PaymentsExport({ payments }: PaymentsExportProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  
  // Get unique events for filtering
  const uniqueEvents = [...new Set(payments.map(payment => payment.event))];
  
  const handleExportToExcel = () => {
    try {
      exportPaymentsToExcel(payments, selectedEvent, '.xls');
      toast.success("Successfully exported payments to Excel");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export payments to Excel");
    }
  };
  
  const handleExportToPDF = () => {
    try {
      exportPaymentsToPDF(payments, selectedEvent);
      toast.success("Successfully exported payments to PDF");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export payments to PDF");
    }
  };
  
  return (
    <div className="flex items-center gap-4">
      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
        <SelectTrigger className="w-[250px] bg-white border-gray-300">
          <SelectValue placeholder="All Events" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={undefined}>All Events</SelectItem>
          {uniqueEvents.map((event) => (
            <SelectItem key={event} value={event}>
              {event}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-white text-gray-800 border-gray-300 hover:text-red-600">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border-gray-200">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportToExcel} className="cursor-pointer text-gray-800 hover:text-red-600">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel (.xls)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportToPDF} className="cursor-pointer text-gray-800 hover:text-red-600">
            <FileText className="h-4 w-4 mr-2" />
            Export to PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
