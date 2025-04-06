
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Hero = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Welcome to Maabara Online™
          </h1>
          <div className="text-xl mb-10 text-white max-w-2xl mx-auto leading-relaxed">
            <p className="mb-4">
              A trade mark of Maabara Hub Africa LTD, a dedicated platform for Continuing Professional Development (CPD) to healthcare providers.
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto mt-12">
            <div className="absolute inset-0 bg-white opacity-10 blur-xl rounded-lg"></div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for events, venues or categories..."
                className="w-full py-7 pl-12 pr-28 text-gray-900 rounded-lg text-lg shadow-lg border-0 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              
              <Link to={`/events?search=${searchTerm}`}>
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 px-5 py-6 text-base">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
