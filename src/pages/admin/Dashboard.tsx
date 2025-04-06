
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard, User, Clock, Users, Award, Tag } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Maabara Online Admin Dashboard</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50 border-b border-purple-100">
              <CardTitle className="text-sm font-medium text-purple-800">Total Events</CardTitle>
              <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <div className="text-2xl font-bold text-purple-700">25</div>
              <p className="text-xs text-purple-600">+5 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-teal-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-teal-50 border-b border-teal-100">
              <CardTitle className="text-sm font-medium text-teal-800">Total Bookings</CardTitle>
              <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <div className="text-2xl font-bold text-teal-700">142</div>
              <p className="text-xs text-teal-600">+18 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50 border-b border-purple-100">
              <CardTitle className="text-sm font-medium text-purple-800">Total Revenue</CardTitle>
              <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <div className="text-2xl font-bold text-purple-700">KES 24,500</div>
              <p className="text-xs text-purple-600">+KES 5,200 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-teal-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-teal-50 border-b border-teal-100">
              <CardTitle className="text-sm font-medium text-teal-800">Upcoming Events</CardTitle>
              <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <div className="text-2xl font-bold text-teal-700">12</div>
              <p className="text-xs text-teal-600">Next one in 2 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-purple-200 shadow-md lg:col-span-2">
            <CardHeader className="bg-purple-50 border-b border-purple-100">
              <CardTitle className="text-purple-800">Recent Activity</CardTitle>
              <CardDescription className="text-purple-600">
                Latest actions performed in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-purple-50 pb-2">
                  <span className="text-gray-800 font-medium">New event created</span>
                  <span className="text-gray-500 text-sm">3 hours ago</span>
                </li>
                <li className="flex justify-between border-b border-purple-50 pb-2">
                  <span className="text-gray-800 font-medium">New booking received</span>
                  <span className="text-gray-500 text-sm">5 hours ago</span>
                </li>
                <li className="flex justify-between border-b border-purple-50 pb-2">
                  <span className="text-gray-800 font-medium">Payment successful</span>
                  <span className="text-gray-500 text-sm">Yesterday</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-800 font-medium">New category added</span>
                  <span className="text-gray-500 text-sm">2 days ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-teal-200 shadow-md">
            <CardHeader className="bg-teal-50 border-b border-teal-100">
              <CardTitle className="text-teal-800">System Overview</CardTitle>
              <CardDescription className="text-teal-600">
                Summary of system resources
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-teal-50 pb-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">125 Registered Users</p>
                    <p className="text-xs text-gray-500">Active accounts</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border-b border-teal-50 pb-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <Award className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">89 Certificates Issued</p>
                    <p className="text-xs text-gray-500">To event attendees</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">5 Active Categories</p>
                    <p className="text-xs text-gray-500">For event classification</p>
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
