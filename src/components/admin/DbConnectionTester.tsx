
import { useState } from 'react';
import { testOnlineConnection } from '@/utils/db-connection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Bug } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      const result = await testOnlineConnection();
      
      // If we got a text response instead of JSON, it means PHP isn't executing
      if (typeof result === 'string' && result.trim().startsWith('<?php')) {
        setRawResponse(result);
        setError('Server returned PHP code instead of executing it. This usually means PHP is not configured correctly on the server.');
        setTestResult(null);
      } else {
        setTestResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // If the error contains a response property, it might be the raw PHP
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
        ) : testResult ? (
          <Tabs defaultValue="results">
            <TabsList className="mb-4">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="debug">Debug Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Status:</span>
                  {testResult.success ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">Connected</Badge>
                  ) : (
                    <Badge variant="destructive">Failed</Badge>
                  )}
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
            </TabsList>
            
            <TabsContent value="error">
              <div className="text-red-500 space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Status:</span>
                  <Badge variant="destructive">Failed</Badge>
                </div>
                <p>Error: {error}</p>
                <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded">
                  <p className="font-bold">Troubleshooting Tips:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Ensure your server is configured to execute PHP files</li>
                    <li>Check that the PHP module is installed and enabled</li>
                    <li>Verify that the .htaccess file is properly configured</li>
                    <li>Use the Raw Response tab to see what the server is returning</li>
                  </ul>
                </div>
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
          </Tabs>
        ) : (
          <div>
            <p>Click the button below to test connection to the online MySQL database.</p>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 rounded">
              <p className="font-bold">Environment Information:</p>
              <p className="mt-1">This test will check if your PHP environment is properly configured to connect to the database.</p>
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
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => window.open('/api/test-db-connection.php', '_blank')}
        >
          <Bug className="mr-2 h-4 w-4" />
          Debug API Endpoint
        </Button>
      </CardFooter>
    </Card>
  );
}
