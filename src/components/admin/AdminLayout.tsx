
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
  Mail
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
        <Sidebar className="border-r border-blue-700 bg-blue-800 text-white">
          <SidebarHeader>
            <h1 className="text-xl font-bold px-4 py-2 text-white">Maabara Online</h1>
            <p className="text-xs text-blue-200 px-4">Admin Panel</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link to="/admin">
                    <SidebarMenuButton 
                      isActive={isActive("/admin")} 
                      tooltip="Dashboard"
                      className={isActive("/admin") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/users">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/users")} 
                      tooltip="Users"
                      className={isActive("/admin/users") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/events">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/events")} 
                      tooltip="Events"
                      className={isActive("/admin/events") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>Events</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/categories">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/categories")} 
                      tooltip="Categories"
                      className={isActive("/admin/categories") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      <span>Categories</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/bookings">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/bookings")} 
                      tooltip="Bookings"
                      className={isActive("/admin/bookings") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Bookings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/payments">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/payments")} 
                      tooltip="Payments"
                      className={isActive("/admin/payments") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Payments</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/certificates">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/certificates")} 
                      tooltip="Certificates"
                      className={isActive("/admin/certificates") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      <span>Certificates</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/mpesa-settings">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/mpesa-settings")} 
                      tooltip="M-Pesa Settings"
                      className={isActive("/admin/mpesa-settings") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <span>M-Pesa Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/gmail-settings">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/gmail-settings")} 
                      tooltip="Gmail Settings"
                      className={isActive("/admin/gmail-settings") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Gmail Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/logs">
                    <SidebarMenuButton 
                      isActive={isActive("/admin/logs")} 
                      tooltip="Activity Logs"
                      className={isActive("/admin/logs") ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-700"}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Activity Logs</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator className="border-blue-700" />
            <div className="px-4 py-2 text-xs">
              <Link to="/" className="text-blue-200 hover:text-white transition-colors">
                Return to Website
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
