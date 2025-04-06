
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { 
  CalendarDays, 
  BookOpen, 
  CreditCard, 
  LayoutDashboard, 
  FileText, 
  Tag, 
  Settings,
  Users,
  Award,
  Mail,
  LogOut,
  HelpCircle
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => currentPath === path;

  return (
    <div className="h-screen">
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="border-r border-gray-200 bg-white text-gray-800">
          <SidebarHeader>
            <h1 className="text-xl font-bold px-4 py-3 text-blue-700">Maabara Online</h1>
            <p className="text-xs text-gray-500 px-4 pb-2">Admin Control Panel</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link to="/admin">
                    <SidebarMenuButton 
                      isActive={isActive("/admin")} 
                      tooltip="Dashboard"
                      className={isActive("/admin") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <LayoutDashboard className="h-5 w-5 mr-3" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/users">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/users")} 
                      tooltip="Manage Users"
                      className={isActive("/admin/users") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <Users className="h-5 w-5 mr-3" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/events">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/events")} 
                      tooltip="Manage Events"
                      className={isActive("/admin/events") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <CalendarDays className="h-5 w-5 mr-3" />
                      <span>Events</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/categories">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/categories")} 
                      tooltip="Manage Categories"
                      className={isActive("/admin/categories") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <Tag className="h-5 w-5 mr-3" />
                      <span>Categories</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarSeparator className="my-3 border-gray-200" />
            
            <SidebarGroup>
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Registration & Payments
              </p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link to="/admin/bookings">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/bookings")} 
                      tooltip="Manage Bookings"
                      className={isActive("/admin/bookings") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <BookOpen className="h-5 w-5 mr-3" />
                      <span>Bookings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/payments">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/payments")} 
                      tooltip="Manage Payments"
                      className={isActive("/admin/payments") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Payments</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/certificates">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/certificates")} 
                      tooltip="Manage Certificates"
                      className={isActive("/admin/certificates") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <Award className="h-5 w-5 mr-3" />
                      <span>Certificates</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarSeparator className="my-3 border-gray-200" />
            
            <SidebarGroup>
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                System Settings
              </p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link to="/admin/mpesa-settings">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/mpesa-settings")} 
                      tooltip="Configure M-Pesa"
                      className={isActive("/admin/mpesa-settings") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <span>M-Pesa Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/gmail-settings">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/gmail-settings")} 
                      tooltip="Configure Gmail"
                      className={isActive("/admin/gmail-settings") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <Mail className="h-5 w-5 mr-3" />
                      <span>Gmail Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/logs">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/logs")} 
                      tooltip="View System Logs"
                      className={isActive("/admin/logs") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:text-red-600 hover:bg-gray-50"}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      <span>Activity Logs</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator className="border-gray-200" />
            <div className="p-4">
              <Link to="/" className="flex items-center py-2 px-3 text-gray-700 hover:text-red-600 rounded hover:bg-gray-50 transition-colors">
                <HelpCircle className="h-5 w-5 mr-3" />
                <span>Help & Support</span>
              </Link>
              <Link to="/" className="flex items-center py-2 px-3 text-gray-700 hover:text-red-600 rounded hover:bg-gray-50 transition-colors">
                <LogOut className="h-5 w-5 mr-3" />
                <span>Return to Website</span>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
