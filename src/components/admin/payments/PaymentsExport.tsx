
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FilePdf, Download } from "lucide-react";
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

interface PaymentsExportProps {
  payments: UIPayment[];
}

export function PaymentsExport({ payments }: PaymentsExportProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  
  // Get unique events for filtering
  const uniqueEvents = [...new Set(payments.map(payment => payment.event))];
  
  const handleExportToExcel = () => {
    exportPaymentsToExcel(payments, selectedEvent);
  };
  
  const handleExportToPDF = () => {
    exportPaymentsToPDF(payments, selectedEvent);
  };
  
  return (
    <div className="flex items-center gap-4">
      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
        <SelectTrigger className="w-[250px]">
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
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportToExcel} className="cursor-pointer">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportToPDF} className="cursor-pointer">
            <FilePdf className="h-4 w-4 mr-2" />
            Export to PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
