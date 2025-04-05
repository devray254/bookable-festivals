
import { useState } from 'react';
import { testOnlineConnection } from '@/utils/db-connection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function DbConnectionTester() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testOnlineConnection();
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
        ) : error ? (
          <div className="text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : (
          <p>Click the button below to test connection to the online MySQL database.</p>
        )}
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
