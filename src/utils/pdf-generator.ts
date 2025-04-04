
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generateCertificatePDF = (
  content: string, 
  userName: string, 
  certificateId: string
): void => {
  try {
    // Create the PDF with landscape orientation
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set background color (off-white/cream)
    pdf.setFillColor(251, 249, 240);
    pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add decorative border
    const margin = 10;
    
    // Add dark vertical bars on the right (similar to the image)
    pdf.setFillColor(30, 25, 15);
    pdf.rect(pageWidth - 30, 0, 15, pageHeight, 'F');
    pdf.setFillColor(50, 40, 25);
    pdf.rect(pageWidth - 40, 0, 5, pageHeight, 'F');
    
    // Add decorative border pattern
    pdf.setDrawColor(200, 190, 170);
    pdf.setLineWidth(0.5);
    
    // Top border pattern
    for (let x = margin; x < pageWidth - margin - 45; x += 10) {
      pdf.line(x, margin, x + 5, margin);
      pdf.line(x + 5, margin, x + 5, margin + 5);
      pdf.line(x + 5, margin + 5, x + 10, margin + 5);
    }
    
    // Bottom border pattern
    for (let x = margin; x < pageWidth - margin - 45; x += 10) {
      pdf.line(x, pageHeight - margin, x + 5, pageHeight - margin);
      pdf.line(x + 5, pageHeight - margin, x + 5, pageHeight - margin - 5);
      pdf.line(x + 5, pageHeight - margin - 5, x + 10, pageHeight - margin - 5);
    }
    
    // Left border pattern
    for (let y = margin; y < pageHeight - margin; y += 10) {
      pdf.line(margin, y, margin, y + 5);
      pdf.line(margin, y + 5, margin + 5, y + 5);
      pdf.line(margin + 5, y + 5, margin + 5, y + 10);
    }
    
    // Right border pattern
    for (let y = margin; y < pageHeight - margin; y += 10) {
      pdf.line(pageWidth - margin - 45, y, pageWidth - margin - 45, y + 5);
      pdf.line(pageWidth - margin - 45, y + 5, pageWidth - margin - 50, y + 5);
      pdf.line(pageWidth - margin - 50, y + 5, pageWidth - margin - 50, y + 10);
    }
    
    // Add "MAABARAONLINE" watermark text with very light opacity
    pdf.setTextColor(230, 225, 215);
    pdf.setFontSize(12);
    
    // Add watermark in a grid pattern
    for (let x = 20; x < pageWidth - 60; x += 40) {
      for (let y = 30; y < pageHeight - 20; y += 20) {
        pdf.saveGraphicsState();
        pdf.text("MAABARAONLINE", x, y, { 
          angle: 30,
          charSpace: 0
        });
        pdf.restoreGraphicsState();
      }
    }
    
    // Company name
    pdf.setTextColor(80, 60, 20);
    pdf.setFontSize(14);
    pdf.text("□ Maabara Online", margin + 15, margin + 20);
    
    // Certificate title
    pdf.setFont("times", "normal");
    pdf.setFontSize(40);
    pdf.text("Participation", margin + 15, margin + 50);
    
    pdf.setFont("times", "italic");
    pdf.text("Certificate", margin + 110, margin + 50);
    
    // "Is hereby presented to" text
    pdf.setFont("times", "normal");
    pdf.setFontSize(16);
    pdf.text("Is hereby presented to", margin + 15, margin + 65);
    
    // Recipient name
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(36);
    pdf.setTextColor(60, 40, 10);
    pdf.text(userName, margin + 15, margin + 85);
    
    // Underline below name
    pdf.setDrawColor(60, 40, 10);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 15, margin + 90, pageWidth - margin - 60, margin + 90);
    
    // Parse certificate content
    const contentLines = content.split('\n');
    let eventTitle = "";
    let eventDate = "";
    
    // Extract event information from content
    for (const line of contentLines) {
      if (line.includes("Event Title")) {
        eventTitle = line.replace(/.*"(.+)".*/, "$1");
      }
      if (line.includes("Event Date")) {
        eventDate = line.replace(/.*\[Event Date\].*/, "Event Date");
      }
    }
    
    // Description text
    pdf.setFont("times", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(100, 80, 40);
    
    const description = `Demonstrated exceptional engagement and involvement during "${eventTitle}", which took place on ${eventDate}, actively participating in all sessions.`;
    
    // Word wrap the description
    const splitDescription = pdf.splitTextToSize(description, pageWidth - margin - 80 - margin);
    pdf.text(splitDescription, margin + 15, margin + 105);
    
    // Signatures
    pdf.setFont("times", "normal");
    pdf.setFontSize(16);
    pdf.setTextColor(80, 60, 30);
    pdf.text("CEO Maabara Online", margin + 25, pageHeight - margin - 30);
    
    pdf.text("CTO Maabara Online", pageWidth/2 + 25, pageHeight - margin - 30);
    
    // Signature lines
    pdf.setDrawColor(80, 60, 30);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 15, pageHeight - margin - 40, margin + 90, pageHeight - margin - 40);
    pdf.line(pageWidth/2 + 15, pageHeight - margin - 40, pageWidth/2 + 90, pageHeight - margin - 40);
    
    // Certificate ID and awarded date
    pdf.setFontSize(12);
    pdf.text(`Certificate ID: ${certificateId}`, margin + 15, pageHeight - margin - 15);
    
    const issuedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');
    
    pdf.text(`Awarded on: ${issuedDate}`, pageWidth/2 + 15, pageHeight - margin - 15);
    
    pdf.save(`Certificate-${userName.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Error generating PDF");
  }
};
