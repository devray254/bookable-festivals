
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // If already logged in, redirect based on role
        if (user.role === 'admin' || user.role === 'organizer') {
          navigate('/admin');
        } else {
          navigate('/events');
        }
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, [navigate]);
};
