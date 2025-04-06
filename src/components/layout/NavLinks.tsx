
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NavLinks() {
  const location = useLocation();
  
  const getButtonStyle = (path: string) => {
    const isActive = location.pathname === path || 
                    (path !== "/" && location.pathname.startsWith(path));
    
    if (isActive) {
      return "text-blue-600 font-medium";
    }
    return "text-gray-800 hover:text-red-600 font-medium";
  };

  return (
    <>
      <Link to="/events">
        <Button variant="ghost" className={getButtonStyle("/events")}>Events</Button>
      </Link>
      <Link to="/about">
        <Button variant="ghost" className={getButtonStyle("/about")}>About Us</Button>
      </Link>
      <Link to="/contact">
        <Button variant="ghost" className={getButtonStyle("/contact")}>Contact Us</Button>
      </Link>
      <Link to="/virtual-academy">
        <Button variant="ghost" className={getButtonStyle("/virtual-academy")}>Virtual Academy</Button>
      </Link>
      <Link to="/faq">
        <Button variant="ghost" className={getButtonStyle("/faq")}>FAQs</Button>
      </Link>
    </>
  );
}
