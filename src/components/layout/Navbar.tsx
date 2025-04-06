
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, User, X } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentLogo } from "@/utils/image-upload";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [logoUrl, setLogoUrl] = useState(getCurrentLogo());
  const isMobile = useIsMobile();

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
    
    // Set up logo URL update listener
    const handleStorageChange = () => {
      setLogoUrl(getCurrentLogo());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for logo updates every 5 seconds (for demo purposes)
    const intervalId = setInterval(() => {
      const currentLogo = getCurrentLogo();
      if (currentLogo !== logoUrl) {
        setLogoUrl(currentLogo);
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [logoUrl]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  const NavLinks = () => (
    <>
      <Link to="/events">
        <Button variant="ghost">Events</Button>
      </Link>
      <Link to="/virtual-academy">
        <Button variant="ghost">Virtual Academy</Button>
      </Link>
      <Link to="/about">
        <Button variant="ghost">About Us</Button>
      </Link>
      <Link to="/contact">
        <Button variant="ghost">Contact Us</Button>
      </Link>
      <Link to="/faq">
        <Button variant="ghost">FAQs</Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <img src={logoUrl} alt="Maabara Online Logo" className="h-10 max-w-[140px] object-contain mr-2" />
        </Link>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">My Bookings</Link>
                  </DropdownMenuItem>
                  {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/site-settings" className="cursor-pointer">Site Settings</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  <SheetClose asChild>
                    <Link to="/events" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">Events</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/virtual-academy" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">Virtual Academy</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/about" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">About Us</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/contact" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">Contact Us</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/faq" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">FAQs</Link>
                  </SheetClose>
                  {!isLoggedIn && (
                    <SheetClose asChild>
                      <Link to="/login" className="w-full">
                        <Button variant="default" className="w-full">Login</Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <NavLinks />
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700 hidden sm:inline">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">My Bookings</Link>
                  </DropdownMenuItem>
                  {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/site-settings" className="cursor-pointer">Site Settings</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
