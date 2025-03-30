
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchActivityLogs } from "@/utils/database";
import { toast } from "sonner";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    toast.info("This is a mock feature. In a real application, this would export logs to CSV.");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-yellow-50">
              Using Mock Data
            </Badge>
            <p className="text-sm text-yellow-600 mt-1">
              This is using mock data since direct MySQL connections cannot run in the browser. 
              In production, this would connect to a backend API.
            </p>
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
          <Button onClick={handleExport}>Export Logs</Button>
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
