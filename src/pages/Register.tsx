
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createUser } from "@/utils/auth";
import { toast } from "sonner";

const Register = () => {
  const [userType, setUserType] = useState("attendee");
  const [organizationType, setOrganizationType] = useState("company");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);

    try {
      const userData = {
        name,
        email,
        password,
        userType,
        organizationType: userType === 'organizer' ? organizationType : null
      };

      const result = await createUser(userData);
      
      if (result.success) {
        toast.success("Registration successful!");
        
        // Store user info in localStorage if needed
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to appropriate page based on user type
        if (userType === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
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

            <Tabs defaultValue="attendee" className="mb-6" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="attendee">Attendee</TabsTrigger>
                <TabsTrigger value="organizer">Event Organizer</TabsTrigger>
              </TabsList>
              <TabsContent value="attendee">
                <p className="text-sm text-gray-600 mt-2">
                  Create an attendee account to discover and book tickets for events.
                </p>
              </TabsContent>
              <TabsContent value="organizer">
                <p className="text-sm text-gray-600 mt-2">
                  Create an organizer account to host and manage your own events.
                </p>
              </TabsContent>
            </Tabs>

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

              {userType === "organizer" && (
                <div className="space-y-2">
                  <Label>Organization Type</Label>
                  <RadioGroup defaultValue="company" onValueChange={setOrganizationType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">Company or Business</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-profit" id="non-profit" />
                      <Label htmlFor="non-profit">Non-Profit Organization</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

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
