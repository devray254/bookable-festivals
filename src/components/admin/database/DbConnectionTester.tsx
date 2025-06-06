
import { useState } from 'react';
import { testConnection } from '@/utils/db-connection';
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
      console.log('Testing database connection...');
      // Try to connect to the database using the API
      const result = await testConnection();
      console.log('Connection test result:', result);
      setTestResult(result ? { success: true, message: 'Successfully connected to the database' } : null);
      
      if (!result) {
        setError('Failed to connect to the database. Check console for details.');
      }
    } catch (err) {
      console.error('Connection test error:', err);
      
      // Use a safer approach to get error details without using the cause property
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setTestResult(null);
      
      // Try to capture raw response if available
      if (err instanceof Error) {
        // Store the error message and any additional details as raw response
        try {
          // We can't use err.cause directly as it's ES2022+, so use a different approach
          const errorDetails = {
            message: err.message,
            stack: err.stack,
            // Include any additional properties as needed
            toString: err.toString()
          };
          setRawResponse(JSON.stringify(errorDetails, null, 2));
        } catch (e) {
          // Ignore stringify errors
          setRawResponse(JSON.stringify({ message: 'Error details unavailable' }));
        }
      }
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
            {testResult ? (
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
