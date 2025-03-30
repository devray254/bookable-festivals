
import React from "react";

interface EventLocationProps {
  location: string;
}

const EventLocation = ({ location }: EventLocationProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Location</h2>
      <p className="text-gray-700 mb-4">{location}</p>
      
      {/* In a real app, this would be an actual map */}
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map would be displayed here</p>
      </div>
    </div>
  );
};

export default EventLocation;
