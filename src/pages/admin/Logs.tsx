
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, Info, FileText } from "lucide-react";
import { fetchActivityLogs, fetchLogById, logActivity } from "@/utils/logs";
import { testApiConnection } from "@/utils/api";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiConnected, setApiConnected] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logDetailsOpen, setLogDetailsOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
    try {
      // Create CSV content
      const headers = ["ID", "Timestamp", "Action", "User", "Details", "IP", "Level"];
      const csvRows = [
        headers.join(","),
        ...filteredLogs.map((log: any) => [
          log.id,
          log.timestamp,
          `"${log.action?.replace(/"/g, '""') || ''}"`,
          `"${log.user?.replace(/"/g, '""') || ''}"`,
          `"${log.details?.replace(/"/g, '""') || ''}"`,
          log.ip,
          log.level
        ].join(","))
      ];
      const csvContent = csvRows.join("\n");
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Logs exported to CSV successfully");
    } catch (error) {
      console.error("Error exporting logs:", error);
      toast.error("Failed to export logs");
    }
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

  const handleViewLogDetails = async (logId: number) => {
    try {
      setLoadingDetails(true);
      const logDetails = await fetchLogById(logId);
      if (logDetails) {
        setSelectedLog(logDetails);
        setLogDetailsOpen(true);
      } else {
        toast.error("Failed to fetch log details");
      }
    } catch (error) {
      console.error("Error fetching log details:", error);
      toast.error("Failed to fetch log details");
    } finally {
      setLoadingDetails(false);
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
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
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
                      <th className="text-left p-2 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log: any) => (
                        <tr key={log.id} className="border-b">
                          <td className="p-2 whitespace-nowrap">{log.timestamp}</td>
                          <td className="p-2 whitespace-nowrap">{log.action}</td>
                          <td className="p-2 whitespace-nowrap">{log.user}</td>
                          <td className="p-2 max-w-xs truncate">{log.details}</td>
                          <td className="p-2 whitespace-nowrap">{log.ip}</td>
                          <td className="p-2 whitespace-nowrap">
                            <Badge variant={log.level === "info" ? "default" : "destructive"}>
                              {log.level}
                            </Badge>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewLogDetails(log.id)}
                              title="View Details"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center">No logs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Log Details Dialog */}
      <Dialog open={logDetailsOpen} onOpenChange={setLogDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this activity log
            </DialogDescription>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : selectedLog ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Log ID</h3>
                  <p>{selectedLog.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
                  <p>{selectedLog.timestamp}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">User</h3>
                <p>{selectedLog.user}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Action</h3>
                <p>{selectedLog.action}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">IP Address</h3>
                <p>{selectedLog.ip}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Level</h3>
                <Badge variant={selectedLog.level === "info" ? "default" : "destructive"}>
                  {selectedLog.level}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Details</h3>
                <div className="p-3 bg-gray-50 rounded-md mt-1 whitespace-pre-wrap">
                  {selectedLog.details}
                </div>
              </div>
            </div>
          ) : (
            <p>No log details available</p>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
