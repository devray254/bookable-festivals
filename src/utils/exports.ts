
import { Booking } from "@/utils/bookings";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { toast } from "sonner";

/**
 * Export bookings data to Excel format
 */
export const exportToExcel = (bookings: Booking[]) => {
  try {
    // Create CSV content
    const headers = ["ID", "Event", "Customer", "Email", "Phone", "Date", "Tickets", "Total (KES)", "Status"];
    let csvContent = headers.join(",") + "\n";

    // Add booking data rows
    bookings.forEach(booking => {
      const row = [
        booking.id,
        `"${booking.event.replace(/"/g, '""')}"`, // Escape quotes in event name
        `"${booking.customer.replace(/"/g, '""')}"`, // Escape quotes in customer name
        booking.email,
        booking.phone,
        booking.date,
        booking.tickets,
        booking.total,
        booking.status
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Bookings exported to Excel format successfully");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Failed to export bookings to Excel");
  }
};

/**
 * Export bookings data to PDF format
 */
export const exportToPDF = (bookings: Booking[]) => {
  try {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.text("Bookings Report", 14, 20);
    
    // Add date
    pdf.setFontSize(11);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table columns
    const columns = ["ID", "Event", "Customer", "Email", "Phone", "Date", "Tickets", "Total", "Status"];
    
    // Table rows
    const rows = bookings.map(booking => [
      booking.id.toString(),
      booking.event.length > 25 ? booking.event.substring(0, 25) + "..." : booking.event,
      booking.customer,
      booking.email,
      booking.phone,
      booking.date,
      booking.tickets.toString(),
      booking.total,
      booking.status
    ]);
    
    // Add table
    pdf.setFontSize(10);
    // @ts-ignore - autoTable comes from the jspdf-autotable plugin
    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      margin: { top: 40 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 40 }, // Event
        2: { cellWidth: 25 }, // Customer
        3: { cellWidth: 40 }, // Email - ensure email is included
        4: { cellWidth: 25 }, // Phone
        5: { cellWidth: 25 }, // Date
        6: { cellWidth: 15 }, // Tickets
        7: { cellWidth: 20 }, // Total
        8: { cellWidth: 20 }  // Status
      },
      headStyles: { fillColor: [115, 103, 240] }
    });
    
    // Save PDF
    pdf.save(`bookings_report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast.success("Bookings exported to PDF format successfully");
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Failed to export bookings to PDF");
  }
};
