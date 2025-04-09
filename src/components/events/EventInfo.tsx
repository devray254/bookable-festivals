
import { Award } from "lucide-react";

interface EventInfoProps {
  description: string;
  cpdPoints?: number;
  targetAudience?: string;
}

const EventInfo = ({ description, cpdPoints, targetAudience }: EventInfoProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Event Details</h2>
      
      {/* CPD Points Badge */}
      {cpdPoints && cpdPoints > 0 && (
        <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-md border border-blue-200">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">
              {cpdPoints} CPD {cpdPoints === 1 ? 'Point' : 'Points'}
            </p>
            {targetAudience && (
              <p className="text-sm text-blue-700">For: {targetAudience}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="prose max-w-none">
        {description.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default EventInfo;
