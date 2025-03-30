
import React from "react";
import { MapPinIcon } from "lucide-react";

interface EventLocationProps {
  location: string;
}

const EventLocation = ({ location }: EventLocationProps) => {
  // In a real app, we would use the location string to query Google Maps or another mapping service
  // For this demo, we'll use a static map image based on the location name
  
  const getMapUrl = (locationName: string) => {
    // Encode the location name for use in a URL
    const encodedLocation = encodeURIComponent(locationName);
    
    // Create a static map URL (in a real app, you might use a Google Maps API key)
    // For this demo, we'll use a placeholder image that resembles a map
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation},Kenya&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodedLocation},Kenya`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Location</h2>
      <div className="flex items-center mb-4">
        <MapPinIcon className="h-5 w-5 mr-2 text-eventPurple-700" />
        <p className="text-gray-700">{location}</p>
      </div>
      
      {/* Simulated map view */}
      <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-200">
          <div className="w-full h-full" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5
          }} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-red-500 h-6 w-6 rounded-full border-2 border-white shadow-md mb-2"></div>
          <div className="bg-white px-3 py-1 rounded-full shadow-md">
            <p className="text-xs font-medium">{location}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Interactive maps will be available in the full version</p>
    </div>
  );
};

export default EventLocation;
