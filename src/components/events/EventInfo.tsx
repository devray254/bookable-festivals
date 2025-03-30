
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2Icon, HeartIcon } from "lucide-react";

interface EventInfoProps {
  description: string;
}

const EventInfo = ({ description }: EventInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">About This Event</h2>
      <p className="text-gray-700 mb-8 whitespace-pre-line">
        {description}
      </p>
      
      <div className="flex space-x-4">
        <Button variant="outline" className="text-gray-700">
          <Share2Icon className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" className="text-gray-700">
          <HeartIcon className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default EventInfo;
