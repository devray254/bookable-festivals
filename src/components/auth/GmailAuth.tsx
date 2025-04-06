
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authenticateWithGmail } from "@/utils/auth";

export const useGmailAuth = () => {
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const navigate = useNavigate();

  const handleGmailLogin = async () => {
    setIsGmailLoading(true);
    
    try {
      // In a real implementation, this would trigger Google OAuth flow
      // For demo purposes, we'll simulate by passing the email as the token
      const gmailToken = prompt("Enter your Gmail address to simulate Google Sign-In");
      
      if (!gmailToken) {
        setIsGmailLoading(false);
        return;
      }
      
      const response = await authenticateWithGmail(gmailToken);
      
      if (response.success) {
        toast.success("Gmail login successful!");
        
        // Store the user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirect based on user role
        if (response.user.role === 'admin' || response.user.role === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } else if (response.newUser) {
        // New user from Gmail, redirect to register with pre-filled email
        toast.info("Please complete your registration");
        navigate('/register', { state: { email: response.email } });
      } else {
        toast.error(response.message || "Gmail login failed.");
      }
    } catch (error) {
      console.error("Gmail login error:", error);
      toast.error("An error occurred during Gmail login. Please try again.");
    } finally {
      setIsGmailLoading(false);
    }
  };

  return {
    isGmailLoading,
    handleGmailLogin
  };
};
