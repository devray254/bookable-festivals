
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { toast } from "sonner";
import { UIPayment } from "@/components/admin/payments/types";

/**
 * Export payments data to Excel format
 */
export const exportPaymentsToExcel = (payments: UIPayment[], eventFilter?: string) => {
  try {
    // Filter by event if specified
    const filteredPayments = eventFilter 
      ? payments.filter(payment => payment.event === eventFilter)
      : payments;
    
    if (filteredPayments.length === 0) {
      toast.error("No payments found to export");
      return;
    }
    
    // Create CSV content
    const headers = ["Transaction ID", "Event", "Customer", "Phone", "Amount (KES)", "Date & Time", "Method", "Status"];
    let csvContent = headers.join(",") + "\n";

    // Add payment data rows
    filteredPayments.forEach(payment => {
      const row = [
        payment.id,
        `"${payment.event.replace(/"/g, '""')}"`, // Escape quotes in event name
        `"${payment.customer.replace(/"/g, '""')}"`, // Escape quotes in customer name
        payment.phone,
        payment.amount,
        payment.date,
        payment.method,
        payment.status
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
      ? `payments_${eventFilter.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`
      : `payments_export_${new Date().toISOString().split('T')[0]}.xls`;
    
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Payments exported to Excel format successfully${eventFilter ? ` for ${eventFilter}` : ''}`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Failed to export payments to Excel");
  }
};

/**
 * Export payments data to PDF format
 */
export const exportPaymentsToPDF = (payments: UIPayment[], eventFilter?: string) => {
  try {
    // Filter by event if specified
    const filteredPayments = eventFilter 
      ? payments.filter(payment => payment.event === eventFilter)
      : payments;
    
    if (filteredPayments.length === 0) {
      toast.error("No payments found to export");
      return;
    }
    
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.text(eventFilter ? `Payments Report for ${eventFilter}` : "Payments Report", 14, 20);
    
    // Add date
    pdf.setFontSize(11);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table columns
    const columns = ["ID", "Event", "Customer", "Phone", "Amount", "Date", "Method", "Status"];
    
    // Table rows
    const rows = filteredPayments.map(payment => [
      payment.id,
      payment.event.length > 20 ? payment.event.substring(0, 20) + "..." : payment.event,
      payment.customer,
      payment.phone,
      payment.amount,
      payment.date,
      payment.method,
      payment.status
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
        0: { cellWidth: 20 }, // ID
        1: { cellWidth: 35 }, // Event
        2: { cellWidth: 30 }, // Customer
        3: { cellWidth: 25 }, // Phone
        4: { cellWidth: 20 }, // Amount
        5: { cellWidth: 25 }, // Date
        6: { cellWidth: 20 }, // Method
        7: { cellWidth: 20 }  // Status
      },
      headStyles: { fillColor: [123, 58, 237] } // Purple color
    });
    
    // Add summary at the bottom
    const totalAmount = filteredPayments
      .filter(payment => payment.status === "successful")
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      
    const successfulCount = filteredPayments.filter(payment => payment.status === "successful").length;
    const pendingCount = filteredPayments.filter(payment => payment.status === "pending").length;
    const failedCount = filteredPayments.filter(payment => payment.status === "failed").length;
    
    // Get the final y position after the table
    // @ts-ignore - This is a valid property from jspdf-autotable
    const finalY = pdf.lastAutoTable.finalY || 150;
    
    pdf.setFontSize(12);
    pdf.text("Summary", 14, finalY + 20);
    pdf.setFontSize(10);
    pdf.text(`Total Revenue: KES ${totalAmount.toLocaleString()}`, 14, finalY + 30);
    pdf.text(`Successful Payments: ${successfulCount}`, 14, finalY + 40);
    pdf.text(`Pending Payments: ${pendingCount}`, 14, finalY + 50);
    pdf.text(`Failed Payments: ${failedCount}`, 14, finalY + 60);
    
    // Save PDF
    const filename = eventFilter 
      ? `payments_${eventFilter.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      : `payments_report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(filename);
    
    toast.success(`Payments exported to PDF format successfully${eventFilter ? ` for ${eventFilter}` : ''}`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Failed to export payments to PDF");
  }
};
