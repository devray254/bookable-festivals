
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { resetUserPassword } from "@/utils/auth";

interface UserRowProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  adminEmail: string;
  onEditUser: (user: any) => void;
}

export function UserRow({ user, adminEmail, onEditUser }: UserRowProps) {
  const [isResetting, setIsResetting] = useState(false);

  // Handle password reset
  const handleResetPassword = async (email: string) => {
    setIsResetting(true);
    try {
      const result = await resetUserPassword(email, adminEmail);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <TableRow key={user.id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {user.role}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEditUser(user)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleResetPassword(user.email)}
            disabled={isResetting}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
