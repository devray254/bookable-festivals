
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
  const [serverInfo, setServerInfo] = useState<string | null>(null);

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

  const checkPhpInfo = () => {
    // Open the phpinfo.php file in a new tab
    window.open('/api/phpinfo.php', '_blank');
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
                  This appears to be a PHP execution issue, not a database connection issue.
                  The server is returning PHP code as text instead of executing it.
                </AlertDescription>
              </Alert>
              
              <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded">
                <p className="font-bold">Troubleshooting Tips:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>This is likely a Lovable platform limitation - it may not support PHP execution</li>
                  <li>Lovable appears to be hosting this as a static site that cannot process PHP</li>
                  <li>You may need to use a serverless function or a different backend approach</li>
                  <li>Consider using API routes with Node.js instead of PHP</li>
                </ul>
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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => window.open('/api/test-db-connection.php', '_blank')}
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug API
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={checkPhpInfo}
          >
            <Server className="mr-2 h-4 w-4" />
            PHP Info
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
