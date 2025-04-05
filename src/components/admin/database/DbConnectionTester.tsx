
import { useState } from 'react';
import { testOnlineConnection } from '@/utils/db-connection';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

import { LoadingIndicator } from './LoadingIndicator';
import { ConnectionTestResult } from './ConnectionTestResult';
import { ConnectionErrorDisplay } from './ConnectionErrorDisplay';
import { ConnectionInfoDisplay } from './ConnectionInfoDisplay';
import { ConnectionActionButtons } from './ConnectionActionButtons';

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
        <LoadingIndicator loading={loading} />
        
        {loading ? null : (
          <>
            {testResult && testResult.success ? (
              <ConnectionTestResult testResult={testResult} />
            ) : error ? (
              <ConnectionErrorDisplay error={error} rawResponse={rawResponse} />
            ) : (
              <ConnectionInfoDisplay />
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <ConnectionActionButtons 
          loading={loading} 
          onTestConnection={handleTestConnection} 
        />
      </CardFooter>
    </Card>
  );
}
