
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserName(user.name || "User");
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold">
          Maabara Online
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/events">
            <Button variant="ghost">Events</Button>
          </Link>
          <Link to="/organizers">
            <Button variant="ghost">Organizers</Button>
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <User size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">{userName}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
