
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { toast } from "sonner";
import { Booking } from "@/utils/bookings";

/**
 * Export bookings data to Excel format
 */
export const exportBookingsToExcel = (bookings: Booking[], eventFilter?: string) => {
  try {
    // Filter by event if specified
    const filteredBookings = eventFilter 
      ? bookings.filter(booking => booking.event === eventFilter)
      : bookings;
    
    if (filteredBookings.length === 0) {
      toast.error("No bookings found to export");
      return;
    }
    
    // Create CSV content
    const headers = ["ID", "Event", "Customer", "Email", "Phone", "Date", "Tickets", "Total (KES)", "Status"];
    let csvContent = headers.join(",") + "\n";

    // Add booking data rows
    filteredBookings.forEach(booking => {
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
    const filename = eventFilter 
      ? `bookings_${eventFilter.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`
      : `bookings_export_${new Date().toISOString().split('T')[0]}.xls`;
    
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Bookings exported to Excel format successfully${eventFilter ? ` for ${eventFilter}` : ''}`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Failed to export bookings to Excel");
  }
};

/**
 * Export bookings data to PDF format
 */
export const exportBookingsToPDF = (bookings: Booking[], eventFilter?: string) => {
  try {
    // Filter by event if specified
    const filteredBookings = eventFilter 
      ? bookings.filter(booking => booking.event === eventFilter)
      : bookings;
    
    if (filteredBookings.length === 0) {
      toast.error("No bookings found to export");
      return;
    }
    
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.text(eventFilter ? `Bookings Report for ${eventFilter}` : "Bookings Report", 14, 20);
    
    // Add date
    pdf.setFontSize(11);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table columns
    const columns = ["ID", "Event", "Customer", "Email", "Phone", "Date", "Tickets", "Total", "Status"];
    
    // Table rows
    const rows = filteredBookings.map(booking => [
      booking.id,
      booking.event.length > 20 ? booking.event.substring(0, 20) + "..." : booking.event,
      booking.customer,
      booking.email,
      booking.phone,
      booking.date,
      booking.tickets,
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
        1: { cellWidth: 35 }, // Event
        2: { cellWidth: 30 }, // Customer
        3: { cellWidth: 30 }, // Email
        4: { cellWidth: 25 }, // Phone
        5: { cellWidth: 20 }, // Date
        6: { cellWidth: 15 }, // Tickets
        7: { cellWidth: 15 }, // Total
        8: { cellWidth: 20 }  // Status
      },
      headStyles: { fillColor: [217, 37, 42] } // Red color
    });
    
    // Add summary at the bottom
    const totalAmount = filteredBookings
      .reduce((sum, booking) => sum + parseInt(booking.total), 0);
      
    const confirmedCount = filteredBookings.filter(booking => booking.status === "confirmed").length;
    const pendingCount = filteredBookings.filter(booking => booking.status === "pending").length;
    const cancelledCount = filteredBookings.filter(booking => booking.status === "cancelled").length;
    
    // Get the final y position after the table
    // @ts-ignore - This is a valid property from jspdf-autotable
    const finalY = pdf.lastAutoTable.finalY || 150;
    
    pdf.setFontSize(12);
    pdf.text("Summary", 14, finalY + 20);
    pdf.setFontSize(10);
    pdf.text(`Total Revenue: KES ${totalAmount.toLocaleString()}`, 14, finalY + 30);
    pdf.text(`Confirmed Bookings: ${confirmedCount}`, 14, finalY + 40);
    pdf.text(`Pending Bookings: ${pendingCount}`, 14, finalY + 50);
    pdf.text(`Cancelled Bookings: ${cancelledCount}`, 14, finalY + 60);
    
    // Save PDF
    const filename = eventFilter 
      ? `bookings_${eventFilter.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      : `bookings_report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(filename);
    
    toast.success(`Bookings exported to PDF format successfully${eventFilter ? ` for ${eventFilter}` : ''}`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Failed to export bookings to PDF");
  }
};
