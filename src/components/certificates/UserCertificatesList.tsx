
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Award, Calendar, Eye } from "lucide-react";
import { generateCertificatePDF } from "@/utils/pdf-generator";
import { generateCertificateContent } from "@/utils/certificates/templates";
import { CertificatePreviewDialog } from "@/components/admin/certificates/CertificatePreviewDialog";

interface UserCertificate {
  id: string;
  event_title: string;
  issued_date: string;
  event_date: string;
  downloaded: boolean;
  cpd_points?: number;
  target_audience?: string;
}

interface UserCertificatesListProps {
  userId: number;
}

export function UserCertificatesList({ userId }: UserCertificatesListProps) {
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewCertificate, setPreviewCertificate] = useState<{
    id: string;
    content: string;
    userName: string;
  } | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.name) {
      setUserName(user.name);
    }
    
    fetchCertificates();
  }, [userId]);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch from the API
      // For now, we'll use mock data
      const response = await fetch(`/api/certificates.php?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCertificates(data);
      } else {
        // For testing: If no data, create mock certificates
        setCertificates([
          {
            id: "CERT-1-123-1678938465",
            event_title: "Science Exhibition",
            issued_date: "2023-08-15",
            event_date: "2023-08-15",
            downloaded: false,
            cpd_points: 5,
            target_audience: "Healthcare Professionals"
          },
          {
            id: "CERT-2-123-1678938465",
            event_title: "Tech Workshop",
            issued_date: "2023-08-20",
            event_date: "2023-08-20",
            downloaded: true,
            cpd_points: 3,
            target_audience: "IT Professionals"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificates");
      
      // For testing: Create mock certificates on error
      setCertificates([
        {
          id: "CERT-1-123-1678938465",
          event_title: "Science Exhibition",
          issued_date: "2023-08-15",
          event_date: "2023-08-15",
          downloaded: false,
          cpd_points: 5,
          target_audience: "Healthcare Professionals"
        },
        {
          id: "CERT-2-123-1678938465",
          event_title: "Tech Workshop",
          issued_date: "2023-08-20",
          event_date: "2023-08-20",
          downloaded: true,
          cpd_points: 3,
          target_audience: "IT Professionals"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (certificate: UserCertificate) => {
    try {
      if (!userName || !certificate.event_title) {
        toast.error("Certificate data is incomplete");
        return;
      }

      const eventDate = new Date(certificate.event_date).toLocaleDateString();
      const issuedDate = new Date(certificate.issued_date).toLocaleDateString();

      const content = generateCertificateContent(
        userName,
        certificate.event_title,
        eventDate,
        issuedDate,
        certificate.cpd_points,
        certificate.target_audience
      );

      setPreviewCertificate({
        id: certificate.id,
        content,
        userName: userName
      });
    } catch (error) {
      console.error("Error previewing certificate:", error);
      toast.error("Error previewing certificate");
    }
  };

  const handleDownload = (certificateId: string, userName?: string, content?: string) => {
    try {
      // Log the download attempt
      console.log("Download certificate:", certificateId, userName, !!content);
      
      if (content && userName) {
        generateCertificatePDF(content, userName, certificateId);
        
        // Mark as downloaded
        try {
          fetch(`/api/get-certificate.php?id=${certificateId}&download=true`);
        } catch (e) {
          console.warn("Error marking certificate as downloaded:", e);
        }
        
        // Update local state
        setCertificates(certs => 
          certs.map(cert => 
            cert.id === certificateId 
              ? { ...cert, downloaded: true } 
              : cert
          )
        );
        
        return;
      }

      const certificate = certificates.find(cert => cert.id === certificateId);
      
      if (!certificate || !userName || !certificate.event_title) {
        console.error("Certificate data is incomplete");
        toast.error("Certificate data is incomplete");
        return;
      }
      
      const eventDate = new Date(certificate.event_date).toLocaleDateString();
      const issuedDate = new Date(certificate.issued_date).toLocaleDateString();

      const certificateContent = generateCertificateContent(
        userName,
        certificate.event_title,
        eventDate,
        issuedDate,
        certificate.cpd_points,
        certificate.target_audience
      );

      generateCertificatePDF(certificateContent, userName, certificate.id);
      
      // Mark as downloaded
      try {
        fetch(`/api/get-certificate.php?id=${certificateId}&download=true`);
      } catch (e) {
        console.warn("Error marking certificate as downloaded:", e);
      }
      
      // Update local state
      setCertificates(certs => 
        certs.map(cert => 
          cert.id === certificateId 
            ? { ...cert, downloaded: true } 
            : cert
        )
      );
      
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Error downloading certificate");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Award className="h-12 w-12 mb-2 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No Certificates Yet</h3>
            <p className="text-sm">
              Attend events fully to earn certificates of participation
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-medium">{certificate.event_title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(certificate.issued_date).toLocaleDateString()}</span>
                  </div>
                  {certificate.cpd_points && certificate.cpd_points > 0 && (
                    <div className="flex items-center text-sm text-blue-600 mt-1">
                      <Award className="h-4 w-4 mr-1" />
                      <span>{certificate.cpd_points} CPD {certificate.cpd_points === 1 ? 'Point' : 'Points'}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePreview(certificate)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(certificate.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CertificatePreviewDialog 
        open={!!previewCertificate}
        onOpenChange={(open) => !open && setPreviewCertificate(null)}
        previewCertificate={previewCertificate}
        onDownload={handleDownload}
      />
    </>
  );
}
