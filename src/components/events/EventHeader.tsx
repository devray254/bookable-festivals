
import React from "react";

interface EventHeaderProps {
  title: string;
  image: string;
  category: string;
  organizer: string;
}

const EventHeader = ({ title, image, category, organizer }: EventHeaderProps) => {
  return (
    <div className="relative h-[400px]">
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/70 to-transparent"></div>
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
        <div className="text-white max-w-3xl">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-blue-600 rounded-full text-white shadow-lg">
              {category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">{title}</h1>
          <p className="text-lg text-white/90 font-medium drop-shadow-md">Organized by <span className="text-blue-200">{organizer}</span></p>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
