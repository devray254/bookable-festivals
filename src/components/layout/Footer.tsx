
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-eventPurple-700 mb-4">Maabara Online</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              At Maabara Online™, our mission is to empower healthcare professionals with continuous learning opportunities that enhance their knowledge, skills, and professional growth.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-eventPurple-700">Home</Link></li>
              <li><Link to="/events" className="hover:text-eventPurple-700">Browse Events</Link></li>
              <li><Link to="/organizers" className="hover:text-eventPurple-700">For Organizers</Link></li>
              <li><Link to="/about" className="hover:text-eventPurple-700">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Help</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/faq" className="hover:text-eventPurple-700">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-eventPurple-700">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-eventPurple-700">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Maabara Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
