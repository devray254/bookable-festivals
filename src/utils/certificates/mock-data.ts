
import { Certificate } from './types';

// Helper function to get mock certificates
export const getMockCertificates = (eventId: number): Certificate[] => {
  return [
    {
      id: `CERT-${eventId}-1-${Date.now()}`,
      event_id: eventId,
      user_id: 1,
      user_name: 'John Doe',
      user_email: 'john@example.com',
      event_title: 'Science Exhibition',
      issued_date: new Date().toISOString(),
      issued_by: 'admin@maabara.co.ke',
      sent_email: false,
      downloaded: false
    },
    {
      id: `CERT-${eventId}-2-${Date.now()}`,
      event_id: eventId,
      user_id: 2,
      user_name: 'Jane Smith',
      user_email: 'jane@example.com',
      event_title: 'Science Exhibition',
      issued_date: new Date().toISOString(),
      issued_by: 'admin@maabara.co.ke',
      sent_email: true,
      downloaded: false
    },
    {
      id: `CERT-${eventId}-3-${Date.now()}`,
      event_id: eventId,
      user_id: 3,
      user_name: 'Alice Johnson',
      user_email: 'alice@example.com',
      event_title: 'Science Exhibition',
      issued_date: new Date().toISOString(),
      issued_by: 'admin@maabara.co.ke',
      sent_email: false,
      downloaded: false
    }
  ];
};
