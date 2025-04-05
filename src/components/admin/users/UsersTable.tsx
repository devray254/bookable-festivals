
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  users: any[];
  isLoading: boolean;
  adminEmail: string;
  onEditUser: (user: any) => void;
  onViewUser: (user: any) => void;
}

export function UsersTable({ users, isLoading, adminEmail, onEditUser, onViewUser }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <UserRow 
              key={user.id}
              user={user} 
              adminEmail={adminEmail} 
              onEditUser={onEditUser}
              onViewUser={onViewUser}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
