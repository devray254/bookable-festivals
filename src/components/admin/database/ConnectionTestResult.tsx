
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server } from 'lucide-react';

interface ConnectionTestResultProps {
  testResult: any;
}

export function ConnectionTestResult({ testResult }: ConnectionTestResultProps) {
  if (!testResult || !testResult.success) {
    return null;
  }

  return (
    <Tabs defaultValue="results">
      <TabsList className="mb-4">
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="debug">Debug Info</TabsTrigger>
      </TabsList>
      
      <TabsContent value="results">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Status:</span>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Connected</Badge>
          </div>
          
          <div>
            <span className="font-semibold">Message:</span>
            <p className="mt-1">{testResult.message}</p>
          </div>
          
          {testResult.server_info && (
            <div>
              <span className="font-semibold">Server Info:</span>
              <p className="mt-1">{testResult.server_info}</p>
            </div>
          )}
          
          {testResult.tables && testResult.tables.length > 0 && (
            <div>
              <span className="font-semibold">Tables Found:</span>
              <ul className="mt-1 list-disc list-inside">
                {testResult.tables.map((table: string, index: number) => (
                  <li key={index}>{table}</li>
                ))}
              </ul>
            </div>
          )}
          
          {testResult.details && (
            <div>
              <span className="font-semibold">Connection Details:</span>
              <ul className="mt-1 list-disc list-inside">
                <li>Host: {testResult.details.host}</li>
                <li>User: {testResult.details.user}</li>
                <li>Database: {testResult.details.database}</li>
              </ul>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="debug">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Raw Response:</span>
          </div>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-[300px]">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}
