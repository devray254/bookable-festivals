
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createUser, authenticateWithGmail } from "@/utils/auth";
import { fetchGmailSettings } from "@/utils/gmail-settings";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from state if coming from Gmail login
  const initialEmail = location.state?.email || "";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Gmail settings to check if Gmail login is enabled
  const { data: gmailSettings } = useQuery({
    queryKey: ['gmail-settings'],
    queryFn: fetchGmailSettings
  });

  const isGmailEnabled = gmailSettings?.enabled;

  // Set email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      return;
    }

    if (!phone.trim()) {
      setError("Phone number is required");
      toast.error("Phone number is required");
      return;
    }
    
    setIsLoading(true);

    try {
      const userData = {
        name,
        email,
        phone,
        password,
        userType: 'attendee'
      };

      console.log("Attempting to register user:", { ...userData, password: "***" });
      
      const result = await createUser(userData);
      console.log("Registration result:", result);
      
      if (result.success) {
        toast.success("Registration successful!");
        
        // Store user info in localStorage if needed
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to events page
        navigate('/events');
      } else {
        setError(result.message || "Registration failed. Please try again.");
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGmailSignup = async () => {
    setIsGmailLoading(true);
    
    try {
      // In a real implementation, this would trigger Google OAuth flow
      // For demo purposes, we'll simulate by passing the email as the token
      const gmailToken = prompt("Enter your Gmail address to simulate Google Sign-Up");
      
      if (!gmailToken) {
        setIsGmailLoading(false);
        return;
      }
      
      const result = await authenticateWithGmail(gmailToken);
      
      if (result.success) {
        // User already exists with this Gmail
        toast.success("Gmail login successful!");
        
        // Store the user info in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect based on user role
        if (result.user.role === 'admin' || result.user.role === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } else if (result.newUser) {
        // New user from Gmail, set the email in the form
        setEmail(result.email);
        toast.info("Please complete your registration with this Gmail address");
      } else {
        toast.error(result.message || "Gmail signup failed.");
      }
    } catch (error) {
      console.error("Gmail signup error:", error);
      toast.error("An error occurred during Gmail signup. Please try again.");
    } finally {
      setIsGmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-gray-600 mt-1">Sign up to start using Maabara Online</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {isGmailEnabled && !initialEmail && (
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleGmailSignup}
                  disabled={isGmailLoading || isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isGmailLoading ? "Processing..." : "Sign up with Gmail"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or sign up with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  readOnly={!!initialEmail}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-eventPurple-700 hover:text-eventPurple-600"
                >
                  Sign in
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

export default Register;
