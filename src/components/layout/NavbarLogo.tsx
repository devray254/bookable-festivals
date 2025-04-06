
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentLogo } from "@/utils/image-upload";

export function NavbarLogo() {
  const [logoUrl, setLogoUrl] = useState(getCurrentLogo());

  useEffect(() => {
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

  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoUrl} 
        alt="Maabara Online Logo" 
        className="h-10 max-w-[140px] object-contain mr-2" 
      />
    </Link>
  );
}
