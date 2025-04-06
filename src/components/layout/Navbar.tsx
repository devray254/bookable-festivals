
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavbarLogo } from "./NavbarLogo";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { useNavAuth } from "@/hooks/useNavAuth";

export function Navbar() {
  const { isLoggedIn, userName, userRole, handleLogout } = useNavAuth();
  const isMobile = useIsMobile();

  return (
    <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <NavbarLogo />
        
        {isMobile ? (
          <MobileMenu 
            isLoggedIn={isLoggedIn}
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
          />
        ) : (
          <div className="flex items-center gap-4">
            <NavLinks />
            
            {isLoggedIn ? (
              <UserMenu 
                userName={userName} 
                userRole={userRole}
                onLogout={handleLogout}
              />
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
