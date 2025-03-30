
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard, User, Clock } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Maabara Online Admin Dashboard</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">+18 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 24,500</div>
              <p className="text-xs text-muted-foreground">+KES 5,200 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Next one in 2 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions performed in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between border-b pb-2">
                  <span>New event created</span>
                  <span className="text-muted-foreground text-sm">3 hours ago</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>New booking received</span>
                  <span className="text-muted-foreground text-sm">5 hours ago</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Payment successful</span>
                  <span className="text-muted-foreground text-sm">Yesterday</span>
                </li>
                <li className="flex justify-between">
                  <span>New category added</span>
                  <span className="text-muted-foreground text-sm">2 days ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Overview</CardTitle>
              <CardDescription>
                Summary of recent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Successful</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Failed</span>
                      <span className="text-sm">15%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
