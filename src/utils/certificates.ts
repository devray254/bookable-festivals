
import { query } from './db-connection';

// Interfaces
interface Certificate {
  id: string;
  event_id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  event_title?: string;
  issued_date: string;
  issued_by: string;
  sent_email: boolean;
  downloaded: boolean;
}

interface CertificateGenerationResult {
  success: boolean;
  certificateId?: string;
  message?: string;
}

interface BulkGenerationResult {
  success: boolean;
  generated?: number;
  total?: number;
  certificates?: Array<{
    certificateId: string;
    userId: number;
    userName: string;
    userEmail: string;
  }>;
  message?: string;
}

// Generate a certificate for a single user
export const generateCertificate = async (
  eventId: number, 
  userId: number, 
  adminEmail: string
): Promise<CertificateGenerationResult> => {
  try {
    const response = await fetch('/api/certificates/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId, userId, adminEmail }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Failed to generate certificate' 
      };
    }
    
    return { 
      success: true, 
      certificateId: data.certificateId,
      message: data.message 
    };
  } catch (error) {
    console.error('Error generating certificate:', error);
    return { 
      success: false, 
      message: 'An error occurred while generating the certificate' 
    };
  }
};

// Generate certificates in bulk for all paid attendees
export const generateBulkCertificates = async (
  eventId: number, 
  adminEmail: string
): Promise<BulkGenerationResult> => {
  try {
    const response = await fetch('/api/certificates/bulk-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId, adminEmail }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Failed to generate certificates in bulk' 
      };
    }
    
    return { 
      success: true, 
      generated: data.generated,
      total: data.total,
      certificates: data.certificates,
      message: data.message 
    };
  } catch (error) {
    console.error('Error generating certificates in bulk:', error);
    return { 
      success: false, 
      message: 'An error occurred while generating certificates in bulk' 
    };
  }
};

// Fetch certificates for an event
export const fetchCertificatesByEvent = async (eventId: number): Promise<Certificate[]> => {
  try {
    const response = await fetch(`/api/certificates/event/${eventId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch certificates');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

// Fetch certificates for a user
export const fetchCertificatesByUser = async (userId: number): Promise<Certificate[]> => {
  try {
    const response = await fetch(`/api/certificates/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user certificates');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    return [];
  }
};

// Fallback method using direct database query
// This serves as a backup if the API endpoints fail
export const fetchCertificatesDirectly = async (eventId: number): Promise<Certificate[]> => {
  try {
    const certificates = await query(
      `SELECT c.*, u.name as user_name, u.email as user_email, e.title as event_title 
       FROM certificates c 
       JOIN users u ON c.user_id = u.id 
       JOIN events e ON c.event_id = e.id 
       WHERE c.event_id = ? 
       ORDER BY c.issued_date DESC`,
      [eventId]
    ) as Certificate[];
    
    return certificates;
  } catch (error) {
    console.error('Error fetching certificates directly:', error);
    return [];
  }
};
