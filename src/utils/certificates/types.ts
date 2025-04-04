
// Types for certificate-related functionality

export interface Certificate {
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

export interface CertificateGenerationResult {
  success: boolean;
  certificateId?: string;
  message?: string;
}

export interface BulkGenerationResult {
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
