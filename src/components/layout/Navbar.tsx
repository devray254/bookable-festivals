
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold">
          Maabara Online
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/events">
            <Button variant="ghost">Events</Button>
          </Link>
          <Link to="/organizers">
            <Button variant="ghost">Organizers</Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost">Admin</Button>
          </Link>
          <Link to="/login">
            <Button variant="default">Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
