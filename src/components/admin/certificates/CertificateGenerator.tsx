
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Award, Loader2, Check, Mail } from "lucide-react";
import { getAllUsers } from "@/utils/auth";
import { generateCertificate, generateBulkCertificates } from "@/utils/certificates";

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
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });

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
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllUsers}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelection} 
                disabled={selectedUsers.length === 0}
              >
                Clear
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                disabled={selectedUsers.length === 0 || isGenerating}
                onClick={handleGenerateCertificates}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Generate Selected
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Bulk Certificate Generation</h3>
              <Button
                onClick={handleBulkGenerate}
                disabled={isBulkGenerating}
              >
                {isBulkGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Generate For All Paid Attendees
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This will generate certificates for all users who have paid for this event and have not yet received a certificate.
            </p>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-1 p-4 font-medium border-b">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1"></div>
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-3">Phone</div>
              </div>
            </div>
            
            <div className="divide-y">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-eventPurple-700" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No users found
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`p-4 hover:bg-gray-50 ${
                      selectedUsers.includes(user.id) ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-1">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleUserSelect(user.id)}
                        />
                      </div>
                      <div className="col-span-4 truncate">{user.name}</div>
                      <div className="col-span-4 truncate">{user.email}</div>
                      <div className="col-span-3 truncate">{user.phone}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
