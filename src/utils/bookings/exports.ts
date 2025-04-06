
import { Booking } from "../bookings";

/**
 * Export bookings to Excel format (.xls)
 * @param bookings Array of bookings to export
 * @param eventFilter Optional event name to filter by
 */
export const exportBookingsToExcel = (bookings: Booking[], eventFilter?: string): void => {
  // Filter bookings if an event filter is provided
  const filteredBookings = eventFilter 
    ? bookings.filter(booking => booking.event === eventFilter)
    : bookings;
    
  // Create HTML table for Excel
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
  
  // Create Excel document with HTML
  const excelDoc = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Bookings</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table {
          border-collapse: collapse;
        }
        td, th {
          border: 1px solid #ccc;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>Bookings Export</h1>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      ${tableHtml}
    </body>
    </html>
  `;
  
  // Create a Blob from the Excel document
  const blob = new Blob([excelDoc], { type: 'application/vnd.ms-excel' });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.xls`;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Export bookings to PDF format (simplified as text)
 * @param bookings Array of bookings to export
 * @param eventFilter Optional event name to filter by
 */
export const exportBookingsToPDF = (bookings: Booking[], eventFilter?: string): void => {
  // Filter bookings if an event filter is provided
  const filteredBookings = eventFilter 
    ? bookings.filter(booking => booking.event === eventFilter)
    : bookings;
  
  // Create text content for PDF (simplified approach)
  let content = 'MAABARA EVENTS - BOOKINGS EXPORT\n\n';
  content += 'Generated: ' + new Date().toLocaleString() + '\n\n';
  
  // Add event filter info if applicable
  if (eventFilter) {
    content += `Filtered by event: ${eventFilter}\n\n`;
  }
  
  // Add summary statistics
  const totalBookings = filteredBookings.length;
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;
  
  content += `SUMMARY:\n`;
  content += `Total Bookings: ${totalBookings}\n`;
  content += `Confirmed: ${confirmedBookings}\n`;
  content += `Pending: ${pendingBookings}\n`;
  content += `Cancelled: ${cancelledBookings}\n\n`;
  
  // Add header row
  content += 'ID\tEVENT\tCUSTOMER\tEMAIL\tPHONE\tDATE\tTICKETS\tTOTAL\tSTATUS\n';
  content += '-------------------------------------------------------------------------\n';
  
  // Add data rows
  filteredBookings.forEach(booking => {
    content += `${booking.id}\t${booking.event}\t${booking.customer}\t${booking.email}\t${booking.phone}\t${booking.date}\t${booking.tickets}\t${booking.total}\t${booking.status}\n`;
  });
  
  // Create a Blob with text content
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.txt`;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
