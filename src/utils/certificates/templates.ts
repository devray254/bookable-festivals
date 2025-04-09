
// Certificate template functionality

// Get certificate template content including the logo
export const getCertificateTemplate = () => {
  return `
Certificate of Participation

This is to certify that

**[Full Name]**

has successfully participated in the event titled

**"[Event Title]"**

held on

**[Event Date]**

organized by **Maabara Online Limited**.

[CPD_POINTS_SECTION]

We appreciate your dedication to professional growth and continued learning.

Issued on: [Certificate Issued Date]

_________________________  
Maabara Online  
www.maabaraonline.com
  `;
};

// Generate an actual certificate content based on user and event data
export const generateCertificateContent = (
  userName: string,
  eventTitle: string,
  eventDate: string,
  issuedDate: string,
  cpdPoints?: number,
  targetAudience?: string
) => {
  const template = getCertificateTemplate();
  
  // Create CPD points section if applicable
  let cpdPointsSection = '';
  if (cpdPoints && cpdPoints > 0) {
    cpdPointsSection = `This event awards **${cpdPoints} CPD ${cpdPoints === 1 ? 'Point' : 'Points'}**`;
    if (targetAudience) {
      cpdPointsSection += ` for ${targetAudience}`;
    }
    cpdPointsSection += '\n\n';
  }
  
  return template
    .replace('[Full Name]', userName)
    .replace('[Event Title]', eventTitle)
    .replace('[Event Date]', eventDate)
    .replace('[Certificate Issued Date]', issuedDate)
    .replace('[CPD_POINTS_SECTION]', cpdPointsSection);
};

// Template for actual certificate PDF
export const logoPath = "/lovable-uploads/624a13a0-9731-45c5-a0dd-e552425a8c41.png";
