
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminLogs() {
  const logs = [
    {
      id: 1,
      timestamp: "2023-08-25 09:30:45",
      action: "Event Created",
      user: "admin@maabara.co.ke",
      details: "Created new event: Science Exhibition",
      ip: "192.168.1.1",
      level: "info"
    },
    {
      id: 2,
      timestamp: "2023-08-25 10:15:22",
      action: "Payment Completed",
      user: "john@example.com",
      details: "Payment for Science Exhibition successful",
      ip: "192.168.1.15",
      level: "info"
    },
    {
      id: 3,
      timestamp: "2023-08-25 11:05:33",
      action: "Booking Created",
      user: "jane@example.com",
      details: "New booking for Tech Workshop",
      ip: "192.168.1.22",
      level: "info"
    },
    {
      id: 4,
      timestamp: "2023-08-25 12:45:10",
      action: "Payment Failed",
      user: "mike@example.com",
      details: "Payment for Chemistry Seminar failed: Invalid card details",
      ip: "192.168.1.30",
      level: "error"
    },
    {
      id: 5,
      timestamp: "2023-08-25 13:20:18",
      action: "User Login",
      user: "admin@maabara.co.ke",
      details: "Admin login successful",
      ip: "192.168.1.1",
      level: "info"
    },
    {
      id: 6,
      timestamp: "2023-08-25 14:35:50",
      action: "Category Created",
      user: "admin@maabara.co.ke",
      details: "Created new category: Engineering",
      ip: "192.168.1.1",
      level: "info"
    },
    {
      id: 7,
      timestamp: "2023-08-25 15:50:27",
      action: "System Error",
      user: "system",
      details: "Database connection timeout",
      ip: "127.0.0.1",
      level: "error"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor all system activities</p>
        </div>
        
        <div className="flex justify-between">
          <div className="relative w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search logs..." 
              className="pl-8" 
            />
          </div>
          <Button>Export Logs</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {logs.map((log) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
