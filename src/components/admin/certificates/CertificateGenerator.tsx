
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Award, Loader2 } from "lucide-react";
import { getAllUsers } from "@/utils/auth";
import { generateCertificate, generateBulkCertificates } from "@/utils/certificates";
import { UsersList } from "./UsersList";
import { CertificateActions } from "./CertificateActions";
import { BulkCertificateSection } from "./BulkCertificateSection";

interface CertificateGeneratorProps {
  eventId: number;
}

export function CertificateGenerator({ eventId }: CertificateGeneratorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Get admin email from localStorage
  useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.email) {
      setAdminEmail(user.email);
    }
  });

  // Fetch all users who have registered
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });

  // Extract users array from the response
  const users = data?.success ? data.users : [];

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.phone?.includes(searchTerm)) && 
    user.role === 'attendee'
  );

  const handleUserSelect = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const selectAllUsers = () => {
    const attendeeIds = filteredUsers
      .filter(user => user.role === 'attendee')
      .map(user => user.id);
    setSelectedUsers(attendeeIds);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const handleGenerateCertificates = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate certificates for selected users
      const results = await Promise.all(
        selectedUsers.map(userId => 
          generateCertificate(eventId, userId, adminEmail)
        )
      );
      
      const successful = results.filter(r => r.success).length;
      const failed = results.length - successful;
      
      if (successful > 0) {
        toast.success(`Generated ${successful} certificates successfully`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to generate ${failed} certificates`);
      }
      
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error generating certificates:", error);
      toast.error("An error occurred while generating certificates");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    setIsBulkGenerating(true);
    
    try {
      const result = await generateBulkCertificates(eventId, adminEmail);
      
      if (result.success) {
        toast.success(`Generated ${result.generated} new certificates out of ${result.total} attendees`);
      } else {
        toast.error(result.message || "Failed to generate certificates");
      }
    } catch (error) {
      console.error("Error generating bulk certificates:", error);
      toast.error("An error occurred while generating certificates in bulk");
    } finally {
      setIsBulkGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <Input 
                placeholder="Search users by name, email or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <CertificateActions 
              selectAllUsers={selectAllUsers}
              clearSelection={clearSelection}
              handleGenerateCertificates={handleGenerateCertificates}
              selectedUsers={selectedUsers}
              isGenerating={isGenerating}
            />
          </div>
          
          <BulkCertificateSection 
            isBulkGenerating={isBulkGenerating}
            onBulkGenerate={handleBulkGenerate}
          />
          
          <UsersList 
            filteredUsers={filteredUsers}
            selectedUsers={selectedUsers}
            onUserSelect={handleUserSelect}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
