
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
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities</p>
          <div className="mt-2">
            <Badge variant={apiConnected ? "default" : "outline"} className={apiConnected ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>
              {apiConnected ? "Connected to Backend API" : "Using Mock Data"}
            </Badge>
            {!apiConnected && (
              <p className="text-sm text-yellow-600 mt-1">
                Cannot connect to the backend API. Please ensure the backend server is running at the correct URL.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search logs..." 
              className="pl-8 border-blue-200 focus:border-blue-400" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button onClick={handleRefresh} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Refresh
            </Button>
            <Button onClick={handleTestLog} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Create Test Log
            </Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </div>
        
        <Card className="dashboard-card dashboard-card-blue overflow-hidden">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-blue-800">System Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">Timestamp</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Details</th>
                      <th>IP Address</th>
                      <th>Level</th>
                      <th className="rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log: any) => (
                        <tr key={log.id}>
                          <td className="whitespace-nowrap">{log.timestamp}</td>
                          <td className="whitespace-nowrap">{log.action}</td>
                          <td className="whitespace-nowrap">{log.user}</td>
                          <td className="max-w-xs truncate">{log.details}</td>
                          <td className="whitespace-nowrap">{log.ip}</td>
                          <td className="whitespace-nowrap">
                            <Badge variant={log.level === "info" ? "default" : "destructive"} 
                                  className={log.level === "info" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-red-100 text-red-800 border-red-200"}>
                              {log.level}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewLogDetails(log.id)}
                              title="View Details"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
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
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Log Details</DialogTitle>
            <DialogDescription className="text-blue-600">
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
                  <p className="font-medium">{selectedLog.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">User</h3>
                <p className="font-medium">{selectedLog.user}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Action</h3>
                <p className="font-medium">{selectedLog.action}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">IP Address</h3>
                <p className="font-medium">{selectedLog.ip}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Level</h3>
                <Badge variant={selectedLog.level === "info" ? "default" : "destructive"} 
                      className={selectedLog.level === "info" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-red-100 text-red-800 border-red-200"}>
                  {selectedLog.level}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Details</h3>
                <div className="p-3 bg-gray-50 rounded-md mt-1 whitespace-pre-wrap border border-blue-100">
                  {selectedLog.details}
                </div>
              </div>
            </div>
          ) : (
            <p>No log details available</p>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogDetailsOpen(false)} className="border-blue-200 text-blue-700 hover:bg-blue-50">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
