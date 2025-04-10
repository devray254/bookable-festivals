
import jsPDF from "jspdf";
import { toast } from "sonner";
import { logoPath } from "./certificates/templates";

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
    
    // Add Maabara Online logo
    const addLogo = () => {
      try {
        // Logo dimensions and position
        const logoWidth = 55;
        const logoHeight = 25;
        const logoX = pageWidth / 2 - logoWidth / 2;
        const logoY = margin + 15;
        
        // Add the image
        pdf.addImage(logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.error("Error adding logo to certificate:", error);
        // Continue without logo if it fails
      }
    };
    
    // Add the logo
    addLogo();
    
    // Add header with logo-like styling
    const addHeader = () => {
      // Certificate title with modern styling - positioned below logo
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(66, 84, 102); // Dark slate blue
      pdf.text("CERTIFICATE", pageWidth / 2, margin + 60, { align: "center" });
      
      pdf.setFontSize(24);
      pdf.setTextColor(115, 103, 240); // Purple
      pdf.text("OF PARTICIPATION", pageWidth / 2, margin + 75, { align: "center" });
    };
    
    addHeader();
    
    // Parse certificate content for information
    const contentLines = content.split('\n');
    let eventTitle = "";
    let eventDate = "";
    let cpdPoints = 0;
    let targetAudience = "";
    
    // Extract event information from content
    for (const line of contentLines) {
      if (line.includes("[Event Title]")) {
        eventTitle = line.replace(/.*"(.+)".*/, "$1");
      }
      if (line.includes("[Event Date]")) {
        eventDate = line.replace(/.*\[Event Date\].*/, "Event Date");
      }
      if (line.includes("CPD Point")) {
        // Extract CPD points from content
        const match = line.match(/\*\*(\d+)\sCPD/);
        if (match && match[1]) {
          cpdPoints = parseInt(match[1], 10);
        }
        
        // Extract target audience
        const audienceMatch = line.match(/for\s(.+)$/);
        if (audienceMatch && audienceMatch[1]) {
          targetAudience = audienceMatch[1];
        }
      }
    }
    
    // Add recipient information with modern styling
    const addRecipientInfo = () => {
      // "This is to certify that" text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("This is to certify that", pageWidth / 2, margin + 95, { align: "center" });
      
      // Recipient name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(28);
      pdf.setTextColor(45, 55, 72); // Dark slate gray
      pdf.text(userName, pageWidth / 2, margin + 110, { align: "center" });
      
      // Add decorative line below name
      pdf.setDrawColor(115, 103, 240); // Purple
      pdf.setLineWidth(1);
      const nameWidth = pdf.getTextWidth(userName);
      const lineStartX = (pageWidth - nameWidth) / 2 - 20;
      const lineEndX = (pageWidth + nameWidth) / 2 + 20;
      pdf.line(lineStartX, margin + 115, lineEndX, margin + 115);
      
      // Event participation text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("has successfully participated in the event titled", pageWidth / 2, margin + 130, { align: "center" });
      
      // Event title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(115, 103, 240); // Purple
      pdf.text(`"${eventTitle}"`, pageWidth / 2, margin + 145, { align: "center" });
      
      // Event date information
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(90, 90, 90);
      pdf.text("held on", pageWidth / 2, margin + 160, { align: "center" });
      
      const formattedEventDate = new Date(eventDate).toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(66, 153, 225); // Blue
      pdf.text(formattedEventDate, pageWidth / 2, margin + 175, { align: "center" });
      
      // Add CPD points if available
      if (cpdPoints > 0) {
        // CPD points badge
        pdf.setFillColor(235, 242, 254); // Light blue background
        pdf.roundedRect(pageWidth / 2 - 80, margin + 185, 160, 25, 5, 5, 'F');
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(66, 153, 225); // Blue
        pdf.text(
          `${cpdPoints} CPD ${cpdPoints === 1 ? 'Point' : 'Points'} Awarded`, 
          pageWidth / 2, 
          margin + 195, 
          { align: "center" }
        );
        
        // Add target audience if available
        if (targetAudience) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.setTextColor(90, 90, 120);
          pdf.text(
            `For: ${targetAudience}`, 
            pageWidth / 2, 
            margin + 205, 
            { align: "center" }
          );
        }
        
        // Organized by text (moved down to accommodate CPD points)
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(90, 90, 90);
        pdf.text("organized by", pageWidth / 2, margin + 225, { align: "center" });
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(45, 55, 72); // Dark slate gray
        pdf.text("Maabara Online Health CPD Provider", pageWidth / 2, margin + 240, { align: "center" });
      } else {
        // Organized by text (original position when no CPD points)
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(90, 90, 90);
        pdf.text("organized by", pageWidth / 2, margin + 190, { align: "center" });
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(45, 55, 72); // Dark slate gray
        pdf.text("Maabara Online Health CPD Provider", pageWidth / 2, margin + 205, { align: "center" });
      }
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
