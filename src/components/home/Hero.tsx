
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroProps {
  logoUrl: string;
}

export const Hero = ({ logoUrl }: HeroProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-gradient-to-r from-eventPurple-700 to-eventPurple-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img 
              src={logoUrl} 
              alt="Maabara Online Logo" 
              className="h-28 md:h-36 object-contain" 
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Welcome to Maabara Online™
          </h1>
          <div className="text-xl md:text-2xl mb-10 text-eventPurple-100 max-w-2xl mx-auto leading-relaxed">
            <p className="mb-4">
              A trade mark of Maabara Hub Africa LTD, a dedicated platform for Continuing Professional Development (CPD) to healthcare providers.
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search for events, venues or categories..."
              className="w-full py-6 pl-12 pr-4 text-gray-900 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            
            <Link to={`/events?search=${searchTerm}`}>
              <Button className="absolute right-1 top-1 bg-eventPink-500 hover:bg-eventPink-600">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
