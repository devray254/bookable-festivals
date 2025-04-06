
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { Booking } from "@/utils/bookings";
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

interface BookingExportProps {
  bookings: Booking[];
}

export function BookingExport({ bookings }: BookingExportProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  
  // Get unique events for filtering
  const uniqueEvents = [...new Set(bookings.map(booking => booking.event))];
  
  const handleExportToExcel = () => {
    try {
      // Create a table with the bookings data
      let tableHtml = '<table>';
      
      // Add header row
      tableHtml += '<tr>';
      tableHtml += '<th>ID</th>';
      tableHtml += '<th>Event</th>';
      tableHtml += '<th>Customer</th>';
      tableHtml += '<th>Email</th>';
      tableHtml += '<th>Phone</th>';
      tableHtml += '<th>Date</th>';
      tableHtml += '<th>Tickets</th>';
      tableHtml += '<th>Total (KES)</th>';
      tableHtml += '<th>Status</th>';
      tableHtml += '</tr>';
      
      // Add data rows
      const filteredBookings = selectedEvent 
        ? bookings.filter(booking => booking.event === selectedEvent)
        : bookings;
        
      filteredBookings.forEach(booking => {
        tableHtml += '<tr>';
        tableHtml += `<td>${booking.id}</td>`;
        tableHtml += `<td>${booking.event}</td>`;
        tableHtml += `<td>${booking.customer}</td>`;
        tableHtml += `<td>${booking.email}</td>`;
        tableHtml += `<td>${booking.phone}</td>`;
        tableHtml += `<td>${booking.date}</td>`;
        tableHtml += `<td>${booking.tickets}</td>`;
        tableHtml += `<td>${booking.total}</td>`;
        tableHtml += `<td>${booking.status}</td>`;
        tableHtml += '</tr>';
      });
      
      tableHtml += '</table>';
      
      // Create a Blob with the HTML table
      const blob = new Blob([
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Bookings</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
        '<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>' +
        tableHtml +
        '</body></html>'
      ], { type: 'application/vnd.ms-excel' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.xls`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Successfully exported bookings to Excel");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export bookings to Excel");
    }
  };
  
  const handleExportToPDF = () => {
    try {
      // Create content for PDF
      let content = 'Bookings Export\n\n';
      content += 'Date: ' + new Date().toLocaleDateString() + '\n\n';
      
      // Add header row
      content += 'ID\tEvent\tCustomer\tEmail\tPhone\tDate\tTickets\tTotal\tStatus\n';
      
      // Filter bookings if an event is selected
      const filteredBookings = selectedEvent 
        ? bookings.filter(booking => booking.event === selectedEvent)
        : bookings;
      
      // Add data rows
      filteredBookings.forEach(booking => {
        content += `${booking.id}\t${booking.event}\t${booking.customer}\t${booking.email}\t${booking.phone}\t${booking.date}\t${booking.tickets}\t${booking.total}\t${booking.status}\n`;
      });
      
      // Create a Blob with text content (simple approach)
      const blob = new Blob([content], { type: 'text/plain' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Successfully exported bookings to text file (PDF alternative)");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export bookings to PDF");
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
            Export to Text/PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
