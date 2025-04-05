
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, UserPlus, Download, Search } from "lucide-react";
import { getAllUsers } from "@/utils/auth";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { UsersTable } from "./UsersTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserDetail } from "./UserDetail";
import { useIsMobile } from "@/hooks/use-mobile";

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminEmail, setAdminEmail] = useState('');
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get admin email from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.email) {
      setAdminEmail(user.email);
    }
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle edit user
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };
  
  // Handle view user details
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search users..." 
              className="pl-8 w-full md:w-[200px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchUsers} disabled={loading} className={isMobile ? "w-full" : ""}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {!isMobile && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          <Button onClick={() => setAddDialogOpen(true)} className={isMobile ? "w-full" : ""}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)] border rounded-md">
        <UsersTable 
          users={filteredUsers} 
          isLoading={loading} 
          adminEmail={adminEmail}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
        />
      </ScrollArea>

      <AddUserDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchUsers}
        adminEmail={adminEmail}
      />

      {selectedUser && (
        <>
          <EditUserDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            user={selectedUser}
            onSuccess={fetchUsers}
            adminEmail={adminEmail}
          />
          
          <Sheet open={userDetailOpen} onOpenChange={setUserDetailOpen}>
            <SheetContent side="right" className="sm:max-w-md w-full">
              <SheetHeader>
                <SheetTitle>User Details</SheetTitle>
              </SheetHeader>
              <UserDetail user={selectedUser} adminEmail={adminEmail} onSuccess={fetchUsers} />
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
