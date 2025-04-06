
import React from "react";

interface EventHeaderProps {
  title: string;
  image: string;
  category: string;
  organizer: string;
}

const EventHeader = ({ title, image, category, organizer }: EventHeaderProps) => {
  return (
    <div className="relative h-96">
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-900/30"></div>
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
        <div className="text-white">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-600 rounded-full text-white">
              {category}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-sm">{title}</h1>
          <p className="text-lg text-white/90">Organized by {organizer}</p>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
