
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserManagement } from "@/components/admin/users/UserManagement";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { DataCard } from "@/components/admin/ui/DataCard";
import { Users, UserCog, UserCheck, UserPlus } from "lucide-react";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DataCard 
            label="Total Users"
            value="256"
            trend={{ value: 8, isPositive: true }}
            icon={<Users className="h-5 w-5 text-primary" />}
          />
          
          <DataCard 
            label="Admin Users"
            value="12"
            trend={{ value: 0, isPositive: true }}
            icon={<UserCog className="h-5 w-5 text-purple-600" />}
            iconClassName="bg-purple-100"
          />
          
          <DataCard 
            label="Active Today"
            value="42"
            trend={{ value: 18, isPositive: true }}
            icon={<UserCheck className="h-5 w-5 text-green-600" />}
            iconClassName="bg-green-100"
          />
          
          <DataCard 
            label="New This Week"
            value="24"
            icon={<UserPlus className="h-5 w-5 text-blue-600" />}
            iconClassName="bg-blue-100"
          />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <UserManagement />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
