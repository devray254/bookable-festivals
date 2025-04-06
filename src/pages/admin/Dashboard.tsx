
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard, User, Clock } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Maabara Online Admin Dashboard</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card dashboard-card-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Events</CardTitle>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">25</div>
              <p className="text-xs text-blue-600">+5 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card dashboard-card-cyan">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700">Total Bookings</CardTitle>
              <div className="h-9 w-9 rounded-full bg-cyan-100 flex items-center justify-center">
                <User className="h-5 w-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-700">142</div>
              <p className="text-xs text-cyan-600">+18 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card dashboard-card-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Revenue</CardTitle>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">KES 24,500</div>
              <p className="text-xs text-blue-600">+KES 5,200 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card dashboard-card-red">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Upcoming Events</CardTitle>
              <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">12</div>
              <p className="text-xs text-red-600">Next one in 2 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="dashboard-card dashboard-card-blue">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="text-blue-800">Recent Activity</CardTitle>
              <CardDescription className="text-blue-600">
                Latest actions performed in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-foreground font-medium">New event created</span>
                  <span className="text-muted-foreground text-sm">3 hours ago</span>
                </li>
                <li className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-foreground font-medium">New booking received</span>
                  <span className="text-muted-foreground text-sm">5 hours ago</span>
                </li>
                <li className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-foreground font-medium">Payment successful</span>
                  <span className="text-muted-foreground text-sm">Yesterday</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-foreground font-medium">New category added</span>
                  <span className="text-muted-foreground text-sm">2 days ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card dashboard-card-cyan">
            <CardHeader className="border-b border-cyan-100">
              <CardTitle className="text-cyan-800">Payment Overview</CardTitle>
              <CardDescription className="text-cyan-600">
                Summary of recent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Successful</span>
                      <span className="text-sm font-medium text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-cyan-100 h-2.5 rounded-full">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">Failed</span>
                      <span className="text-sm font-medium text-red-600">15%</span>
                    </div>
                    <div className="w-full bg-red-100 h-2.5 rounded-full">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
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
