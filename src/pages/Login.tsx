
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authenticateUser, authenticateWithGmail } from "@/utils/auth";
import { fetchGmailSettings } from "@/utils/gmail-settings";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Gmail settings to check if Gmail login is enabled
  const { data: gmailSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['gmail-settings'],
    queryFn: fetchGmailSettings
  });

  // Default to true while loading to show the Gmail button
  const isGmailEnabled = isSettingsLoading ? true : gmailSettings?.enabled;

  // Check if user is already logged in
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // If already logged in, redirect based on role
        if (user.role === 'admin' || user.role === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate a login attempt
      // In a real-world scenario, we'd validate with a backend
      // For now, we're using authenticateUser which is aliased to authenticateWithGmail
      // and only expects the email as a parameter
      const result = await authenticateUser(email);
      
      if (result.success) {
        toast.success("Login successful!");
        
        // Store the user info in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect based on user role
        if (result.user.role === 'admin' || result.user.role === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } else {
        toast.error(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-600 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={handleGmailLogin}
                  disabled={isGmailLoading || isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isGmailLoading ? "Signing in..." : "Sign in with Gmail"}
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
