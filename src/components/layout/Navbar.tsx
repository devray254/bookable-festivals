
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-eventPurple-700">
          BookEvent
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link 
            to="/events" 
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/events" 
                ? "bg-eventPurple-100 text-eventPurple-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Events
          </Link>
          
          <Link 
            to="/login" 
            className={`px-3 py-2 rounded-md ${
              location.pathname === "/login" 
                ? "bg-eventPurple-100 text-eventPurple-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Login
          </Link>
          
          <Link to="/register">
            <Button className="bg-eventPurple-700 hover:bg-eventPurple-800">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
