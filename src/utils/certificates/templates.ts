
// Certificate template functionality

// Function to get certificate template content
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
