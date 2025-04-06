
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { resetUserPassword, updateUser } from "@/utils/auth";
import { RefreshCw, Edit, UserX, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserDetailProps {
  user: any;
  adminEmail: string;
  onSuccess: () => void;
}

export function UserDetail({ user, adminEmail, onSuccess }: UserDetailProps) {
  const [isResetting, setIsResetting] = useState(false);
  
  // Handle password reset
  const handleResetPassword = async () => {
    setIsResetting(true);
    try {
      // Pass the correct arguments: userId, newPassword, adminEmail
      const result = await resetUserPassword(user.id, "tempPassword123", adminEmail);
      if (result.success) {
        toast.success(result.message || "Password reset successfully");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred during password reset");
    } finally {
      setIsResetting(false);
    }
  };
  
  // Calculate when user was created
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown";
  const lastLogin = user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never";
  
  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-3xl font-semibold text-primary">
            {user.name?.charAt(0).toUpperCase() || "?"}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="text-muted-foreground">{user.email}</p>
        <div className="mt-2">
          <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
            {user.role}
          </Badge>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phone</span>
          <span>{user.phone || "Not provided"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Organization</span>
          <span>{user.organization_type || "Not specified"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{createdAt}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Login</span>
          <span>{lastLogin}</span>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h4 className="font-medium">Actions</h4>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start">
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={handleResetPassword}
            disabled={isResetting}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? "Resetting..." : "Reset Password"}
          </Button>
          
          <Button variant="outline" className="justify-start">
            <LogIn className="h-4 w-4 mr-2" />
            Login as User
          </Button>
          
          <Button variant="destructive" className="justify-start">
            <UserX className="h-4 w-4 mr-2" />
            Disable Account
          </Button>
        </div>
      </div>
    </div>
  );
}
