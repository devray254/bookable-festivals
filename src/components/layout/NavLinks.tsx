
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NavLinks() {
  return (
    <>
      <Link to="/events">
        <Button variant="ghost">Events</Button>
      </Link>
      <Link to="/about">
        <Button variant="ghost">About Us</Button>
      </Link>
      <Link to="/contact">
        <Button variant="ghost">Contact Us</Button>
      </Link>
      <Link to="/virtual-academy">
        <Button variant="ghost">Virtual Academy</Button>
      </Link>
      <Link to="/faq">
        <Button variant="ghost">FAQs</Button>
      </Link>
    </>
  );
}
