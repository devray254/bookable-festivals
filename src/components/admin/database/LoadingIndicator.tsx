
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  loading: boolean;
}

export function LoadingIndicator({ loading }: LoadingIndicatorProps) {
  if (!loading) {
    return null;
  }

  return (
    <div className="flex justify-center items-center py-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Testing connection...</span>
    </div>
  );
}
