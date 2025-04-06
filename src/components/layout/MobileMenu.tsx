
import { Link } from "react-router-dom";
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

  return (
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
            {isAdmin && (
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
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
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
              <Link to="/about" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">About Us</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/contact" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">Contact Us</Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/virtual-academy" className="flex items-center py-2 px-3 rounded-md hover:bg-muted">Virtual Academy</Link>
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
  );
}
