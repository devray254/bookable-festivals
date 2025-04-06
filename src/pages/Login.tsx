
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchGmailSettings } from "@/utils/gmail-settings";
import { LoginForm } from "@/components/auth/LoginForm";
import { useGmailAuth } from "@/components/auth/GmailAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Login = () => {
  // Check if user is already logged in and redirect if needed
  useAuthRedirect();

  // Gmail authentication hook
  const { isGmailLoading, handleGmailLogin } = useGmailAuth();

  // Fetch Gmail settings to check if Gmail login is enabled
  const { data: gmailSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['gmail-settings'],
    queryFn: fetchGmailSettings
  });

  // Default to true while loading to show the Gmail button
  const isGmailEnabled = isSettingsLoading ? true : gmailSettings?.enabled;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <LoginForm 
            onGmailLogin={handleGmailLogin}
            isGmailEnabled={isGmailEnabled} 
            isGmailLoading={isGmailLoading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
