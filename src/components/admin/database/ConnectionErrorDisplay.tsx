
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface ConnectionErrorDisplayProps {
  error: string | null;
  rawResponse: string | null;
}

export function ConnectionErrorDisplay({ error, rawResponse }: ConnectionErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <Tabs defaultValue="error">
      <TabsList className="mb-4">
        <TabsTrigger value="error">Error</TabsTrigger>
        <TabsTrigger value="raw">Raw Response</TabsTrigger>
        <TabsTrigger value="help">Troubleshooting</TabsTrigger>
      </TabsList>
      
      <TabsContent value="error">
        <div className="text-red-500 space-y-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Status:</span>
            <Badge variant="destructive">Failed</Badge>
          </div>
          <p>Error: {error}</p>
        </div>
      </TabsContent>
      
      <TabsContent value="raw">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Raw Server Response:</span>
          </div>
          <div className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-[300px]">
            <pre>{rawResponse || 'No raw response available'}</pre>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="help">
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            There appears to be an issue connecting to the database or Node.js API.
          </AlertDescription>
        </Alert>
        
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded">
          <p className="font-bold">Troubleshooting Tips:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Check that the Node.js API server is running</li>
            <li>Verify the database credentials in the connection configuration</li>
            <li>Make sure your database allows connections from your API server's IP</li>
            <li>Check the network connectivity between your API server and the database</li>
            <li>Look at the raw response for more detailed error information</li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
}
