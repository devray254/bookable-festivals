
import { Link, useLocation } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userName: string;
  userRole?: string;
  onLogout: () => void;
}

export function MobileMenu({ isLoggedIn, userName, userRole, onLogout }: MobileMenuProps) {
  const isAdmin = userRole === 'admin';
  const location = useLocation();
  
  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path || 
                    (path !== "/" && location.pathname.startsWith(path));
    
    if (isActive) {
      return "flex items-center py-2 px-3 rounded-md text-blue-600 font-medium";
    }
    return "flex items-center py-2 px-3 rounded-md text-gray-800 hover:text-red-600";
  };

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full text-gray-800 border-gray-300">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer text-gray-800 hover:text-red-600">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer text-gray-800 hover:text-red-600">My Bookings</Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer text-gray-800 hover:text-red-600">Admin Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/site-settings" className="cursor-pointer text-gray-800 hover:text-red-600">Site Settings</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 hover:text-red-700">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="text-gray-800 border-gray-300">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white">
          <div className="flex flex-col gap-4 mt-8">
            <SheetClose asChild>
              <Link to="/events" className={getLinkStyle("/events")}>Events</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/about" className={getLinkStyle("/about")}>About Us</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/contact" className={getLinkStyle("/contact")}>Contact Us</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/virtual-academy" className={getLinkStyle("/virtual-academy")}>Virtual Academy</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/faq" className={getLinkStyle("/faq")}>FAQs</Link>
            </SheetClose>
            {!isLoggedIn && (
              <SheetClose asChild>
                <Link to="/login" className="w-full">
                  <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
                </Link>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
