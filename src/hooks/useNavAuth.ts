
import { useState, useEffect } from "react";

interface User {
  name: string;
  role?: string;
}

export function useNavAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setIsLoggedIn(true);
        setUserName(user.name || "User");
        setUserRole(user.role);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName("");
    setUserRole(undefined);
    window.location.href = "/";
  };

  return {
    isLoggedIn,
    userName,
    userRole,
    handleLogout
  };
}
