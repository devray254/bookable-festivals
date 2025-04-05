
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
  issuedDate: string
) => {
  const template = getCertificateTemplate();
  
  return template
    .replace('[Full Name]', userName)
    .replace('[Event Title]', eventTitle)
    .replace('[Event Date]', eventDate)
    .replace('[Certificate Issued Date]', issuedDate);
};

// Template for actual certificate PDF
export const logoPath = "/lovable-uploads/624a13a0-9731-45c5-a0dd-e552425a8c41.png";
