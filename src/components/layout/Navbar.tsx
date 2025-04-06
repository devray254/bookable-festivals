
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
    <nav className="bg-background border-b sticky top-0 z-10">
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
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
