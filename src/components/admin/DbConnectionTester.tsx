
import { useState } from 'react';
import { testOnlineConnection } from '@/utils/db-connection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Bug, Server, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DbConnectionTester() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    try {
      // Try to connect to the database using the Node.js API
      const result = await testOnlineConnection();
      setTestResult(result);
      
      if (!result.success) {
        setError(result.message || 'Failed to connect to the database');
        if (result.response) {
          setRawResponse(result.response);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      if (err instanceof Error && 'response' in err) {
        setRawResponse((err as any).response);
      }
      setTestResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Testing connection...</span>
          </div>
        ) : testResult && testResult.success ? (
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
        ) : error ? (
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
        ) : (
          <div>
            <p>Click the button below to test connection to the online MySQL database.</p>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 rounded">
              <p className="font-bold">Environment Information:</p>
              <p className="mt-1">This test will check if your Node.js API can properly connect to the MySQL database.</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleTestConnection} 
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
      </CardFooter>
    </Card>
  );
}
