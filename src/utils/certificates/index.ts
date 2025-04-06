
// Main entry point for certificate-related functions
import { fetchCertificatesByEvent, fetchCertificatesByUser } from './fetch-certificates';
import { generateCertificate, generateBulkCertificates } from './generate-certificates';
import { generateCertificateContent } from './templates';
import { sendCertificateEmail, sendBulkCertificateEmails } from './email-certificates';

// Export all certificate functions
export {
  fetchCertificatesByEvent,
  fetchCertificatesByUser,
  generateCertificate,
  generateBulkCertificates,
  generateCertificateContent,
  sendCertificateEmail,
  sendBulkCertificateEmails
};
