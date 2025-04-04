
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
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Set gradient background
    const addGradientBackground = () => {
      // Create gradient background (light blue to white)
      for (let i = 0; i < pageHeight; i += 0.5) {
        const ratio = i / pageHeight;
        // Gradient from light blue to white
        const r = Math.floor(235 + (255 - 235) * ratio);
        const g = Math.floor(242 + (255 - 242) * ratio);
        const b = Math.floor(250 + (255 - 250) * ratio);
        
        pdf.setDrawColor(r, g, b);
        pdf.setLineWidth(0.5);
        pdf.line(0, i, pageWidth, i);
      }
    };
    
    addGradientBackground();
    
    // Add decorative border with modern style
    const margin = 15;
    
    // Add decorative geometric elements
    const addGeometricElements = () => {
      // Top left corner decorative element
      pdf.setFillColor(115, 103, 240); // Purple accent
      pdf.circle(margin, margin, 8, 'F');
      pdf.setFillColor(66, 153, 225); // Blue accent
      pdf.circle(margin, margin, 5, 'F');
      
      // Bottom right corner decorative element
      pdf.setFillColor(115, 103, 240); // Purple accent
      pdf.circle(pageWidth - margin, pageHeight - margin, 8, 'F');
      pdf.setFillColor(66, 153, 225); // Blue accent
      pdf.circle(pageWidth - margin, pageHeight - margin, 5, 'F');
      
      // Modern design element - top right
      pdf.setFillColor(115, 103, 240, 0.5); // Semi-transparent purple
      pdf.roundedRect(pageWidth - 80, 0, 80, 40, 3, 3, 'F');
      pdf.setFillColor(66, 153, 225, 0.3); // Semi-transparent blue
      pdf.roundedRect(pageWidth - 70, 10, 70, 40, 3, 3, 'F');
      
      // Modern design element - bottom left
      pdf.setFillColor(115, 103, 240, 0.5); // Semi-transparent purple
      pdf.roundedRect(0, pageHeight - 40, 80, 40, 3, 3, 'F');
      pdf.setFillColor(66, 153, 225, 0.3); // Semi-transparent blue
      pdf.roundedRect(10, pageHeight - 50, 70, 40, 3, 3, 'F');
    };
    
    addGeometricElements();
    
    // Add subtle watermark pattern
    const addWatermark = () => {
      pdf.setTextColor(230, 230, 240, 0.2); // Very light color for watermark
      pdf.setFontSize(10);
      
      for (let x = 40; x < pageWidth - 40; x += 60) {
        for (let y = 40; y < pageHeight - 40; y += 30) {
          // Random subtle angle for each watermark
          const angle = ((x + y) % 60) - 30;
          
          pdf.saveGraphicsState();
          pdf.text("MAABARAONLINE", x, y, { 
            angle: angle,
            charSpace: 0.5
          });
          pdf.restoreGraphicsState();
        }
      }
    };
    
    addWatermark();
    
    // Add modern border
    const addModernBorder = () => {
      // Main border - thin line
      pdf.setDrawColor(115, 103, 240); // Purple
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin, 5, 5, 'S');
      
      // Secondary border - dashed
      pdf.setDrawColor(66, 153, 225); // Blue
      pdf.setLineWidth(0.3);
      pdf.setLineDashPattern([2, 2], 0);
      pdf.roundedRect(margin + 3, margin + 3, pageWidth - 2 * (margin + 3), pageHeight - 2 * (margin + 3), 3, 3, 'S');
      pdf.setLineDashPattern([], 0); // Reset dash pattern
    };
    
    addModernBorder();
    
    // Add header with logo-like styling
    const addHeader = () => {
      // Company name styled as logo
      pdf.setFillColor(115, 103, 240); // Purple
      pdf.roundedRect(margin + 5, margin + 10, 55, 12, 6, 6, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("MAABARA ONLINE", margin + 10, margin + 18.5);
      
      // Certificate title with modern styling
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(66, 84, 102); // Dark slate blue
      pdf.text("CERTIFICATE", pageWidth / 2, margin + 50, { align: "center" });
      
      pdf.setFontSize(24);
      pdf.setTextColor(115, 103, 240); // Purple
      pdf.text("OF PARTICIPATION", pageWidth / 2, margin + 65, { align: "center" });
    };
    
    addHeader();
    
    // Parse certificate content for information
    const contentLines = content.split('\n');
    let eventTitle = "";
    let eventDate = "";
    
    // Extract event information from content
    for (const line of contentLines) {
      if (line.includes("[Event Title]")) {
        eventTitle = line.replace(/.*"(.+)".*/, "$1");
      }
      if (line.includes("[Event Date]")) {
        eventDate = line.replace(/.*\[Event Date\].*/, "Event Date");
      }
    }
    
    // Add recipient information with modern styling
    const addRecipientInfo = () => {
      // "This is to certify that" text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("This is to certify that", pageWidth / 2, margin + 85, { align: "center" });
      
      // Recipient name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(28);
      pdf.setTextColor(45, 55, 72); // Dark slate gray
      pdf.text(userName, pageWidth / 2, margin + 100, { align: "center" });
      
      // Add decorative line below name
      pdf.setDrawColor(115, 103, 240); // Purple
      pdf.setLineWidth(1);
      const nameWidth = pdf.getTextWidth(userName);
      const lineStartX = (pageWidth - nameWidth) / 2 - 20;
      const lineEndX = (pageWidth + nameWidth) / 2 + 20;
      pdf.line(lineStartX, margin + 105, lineEndX, margin + 105);
      
      // Event participation text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("has successfully participated in the event titled", pageWidth / 2, margin + 120, { align: "center" });
      
      // Event title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(115, 103, 240); // Purple
      pdf.text(`"${eventTitle}"`, pageWidth / 2, margin + 135, { align: "center" });
      
      // Event date information
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("held on", pageWidth / 2, margin + 150, { align: "center" });
      
      const formattedEventDate = new Date(eventDate).toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(66, 153, 225); // Blue
      pdf.text(formattedEventDate, pageWidth / 2, margin + 165, { align: "center" });
      
      // Organized by text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("organized by", pageWidth / 2, margin + 180, { align: "center" });
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(45, 55, 72); // Dark slate gray
      pdf.text("Maabara Online Limited", pageWidth / 2, margin + 195, { align: "center" });
    };
    
    addRecipientInfo();
    
    // Add appreciation text
    const addAppreciation = () => {
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(12);
      pdf.setTextColor(90, 90, 90);
      pdf.text(
        "We appreciate your dedication to professional growth and continued learning.",
        pageWidth / 2, 
        pageHeight - margin - 50,
        { align: "center" }
      );
    };
    
    addAppreciation();
    
    // Add signature section
    const addSignatureSection = () => {
      // Signature line
      pdf.setDrawColor(115, 103, 240); // Purple
      pdf.setLineWidth(0.5);
      pdf.line(margin + 60, pageHeight - margin - 30, margin + 140, pageHeight - margin - 30);
      
      // Signature text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(66, 84, 102); // Dark slate blue
      pdf.text("Maabara Online", margin + 100, pageHeight - margin - 20, { align: "center" });
      pdf.setFontSize(10);
      pdf.text("www.maabaraonline.com", margin + 100, pageHeight - margin - 10, { align: "center" });
      
      // Add certificate ID and issue date with modern styling
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(115, 103, 240); // Purple
      
      // Certificate ID with modern badge-like styling
      pdf.setFillColor(242, 242, 255);
      pdf.roundedRect(pageWidth - margin - 140, pageHeight - margin - 35, 120, 25, 5, 5, 'F');
      
      pdf.setTextColor(66, 84, 102); // Dark slate blue
      pdf.text(`Certificate ID: ${certificateId}`, pageWidth - margin - 80, pageHeight - margin - 25, { align: "center" });
      
      const issuedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      
      pdf.text(`Issued on: ${issuedDate}`, pageWidth - margin - 80, pageHeight - margin - 15, { align: "center" });
    };
    
    addSignatureSection();
    
    pdf.save(`Certificate-${userName.replace(/\s+/g, '-')}.pdf`);
    toast.success("Certificate downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Error generating PDF");
  }
};
