
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchActivityLogs, logActivity } from "@/utils/logs";
import { testApiConnection } from "@/utils/api";
import { toast } from "sonner";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testApiConnection();
      setApiConnected(connected);
    };
    
    checkConnection();
  }, []);

  useEffect(() => {
    const getLogs = async () => {
      try {
        setLoading(true);
        const logsData = await fetchActivityLogs();
        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, []);

  // Filter logs based on search query
  const filteredLogs = logs.filter((log: any) => 
    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.user?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    toast.info("Exporting logs to CSV");
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const logsData = await fetchActivityLogs();
      setLogs(logsData);
      toast.success("Logs refreshed successfully");
    } catch (error) {
      console.error("Error refreshing logs:", error);
      toast.error("Failed to refresh logs");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLog = async () => {
    try {
      const result = await logActivity({
        action: 'Test Log',
        user: 'admin@maabara.co.ke',
        details: 'This is a test log entry',
        level: 'info'
      });
      
      if (result.success) {
        toast.success("Test log created successfully");
        handleRefresh();
      } else {
        toast.error(result.message || "Failed to create test log");
      }
    } catch (error) {
      console.error("Error creating test log:", error);
      toast.error("Failed to create test log");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities</p>
          <div className="mt-2">
            <Badge variant={apiConnected ? "default" : "outline"} className={apiConnected ? "bg-green-50" : "bg-yellow-50"}>
              {apiConnected ? "Connected to Backend API" : "Using Mock Data"}
            </Badge>
            {!apiConnected && (
              <p className="text-sm text-yellow-600 mt-1">
                Cannot connect to the backend API. Please ensure the backend server is running at the correct URL.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="relative w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search logs..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-x-2">
            <Button onClick={handleRefresh} variant="outline">Refresh</Button>
            <Button onClick={handleTestLog} variant="outline">Create Test Log</Button>
            <Button onClick={handleExport}>Export Logs</Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading logs...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 whitespace-nowrap">Timestamp</th>
                      <th className="text-left p-2 whitespace-nowrap">Action</th>
                      <th className="text-left p-2 whitespace-nowrap">User</th>
                      <th className="text-left p-2">Details</th>
                      <th className="text-left p-2 whitespace-nowrap">IP Address</th>
                      <th className="text-left p-2 whitespace-nowrap">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log: any) => (
                        <tr key={log.id} className="border-b">
                          <td className="p-2 whitespace-nowrap">{log.timestamp}</td>
                          <td className="p-2 whitespace-nowrap">{log.action}</td>
                          <td className="p-2 whitespace-nowrap">{log.user}</td>
                          <td className="p-2">{log.details}</td>
                          <td className="p-2 whitespace-nowrap">{log.ip}</td>
                          <td className="p-2 whitespace-nowrap">
                            <Badge variant={log.level === "info" ? "default" : "destructive"}>
                              {log.level}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">No logs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
