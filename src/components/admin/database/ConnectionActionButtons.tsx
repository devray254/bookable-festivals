
import { Button } from '@/components/ui/button';
import { Loader2, Bug, Server } from 'lucide-react';

interface ConnectionActionButtonsProps {
  loading: boolean;
  onTestConnection: () => Promise<void>;
}

export function ConnectionActionButtons({ 
  loading, 
  onTestConnection 
}: ConnectionActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        onClick={onTestConnection} 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          'Test Database Connection'
        )}
      </Button>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={() => window.open('/api/test-db-connection', '_blank')}
        >
          <Bug className="mr-2 h-4 w-4" />
          Debug API
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={() => window.open('/api/health', '_blank')}
        >
          <Server className="mr-2 h-4 w-4" />
          API Status
        </Button>
      </div>
    </div>
  );
}
