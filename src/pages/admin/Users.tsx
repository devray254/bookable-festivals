
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserManagement } from "@/components/admin/users/UserManagement";
import { Separator } from "@/components/ui/separator";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions.
          </p>
        </div>
        <Separator />
        <UserManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
