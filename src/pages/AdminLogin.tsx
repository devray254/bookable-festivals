
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/layout/Footer";
import { authenticateUser } from "@/utils/database";
import { toast } from "sonner";
import { LockKeyhole, Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authenticateUser(email, password);
      
      if (result.success && result.user.role === 'organizer') {
        toast.success("Admin login successful!");
        
        // Store the user info in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        toast.error("Login failed. Invalid admin credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full bg-background p-4 border-b flex justify-center">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-eventPurple-700 mr-2" />
          <h1 className="text-xl font-bold">Maabara Admin</h1>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <LockKeyhole className="h-12 w-12 text-eventPurple-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
              <p className="text-gray-600 mt-1">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
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

              <Button
                type="submit"
                className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign in to Admin"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
