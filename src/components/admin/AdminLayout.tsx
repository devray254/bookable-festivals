
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
        <Sidebar className="bg-sidebar">
          <SidebarHeader>
            <h1 className="text-xl font-bold px-4 py-2 text-sidebar-foreground">Maabara Online</h1>
            <p className="text-xs text-sidebar-foreground/70 px-4">Admin Panel</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link to="/admin">
                    <SidebarMenuButton isActive={isActive("/admin")} tooltip="Dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/users">
                    <SidebarMenuButton isActive={isActive("/admin/users")} tooltip="Users">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/events">
                    <SidebarMenuButton isActive={isActive("/admin/events")} tooltip="Events">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>Events</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/categories">
                    <SidebarMenuButton isActive={isActive("/admin/categories")} tooltip="Categories">
                      <Tag className="h-4 w-4 mr-2" />
                      <span>Categories</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/bookings">
                    <SidebarMenuButton isActive={isActive("/admin/bookings")} tooltip="Bookings">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Bookings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/payments">
                    <SidebarMenuButton isActive={isActive("/admin/payments")} tooltip="Payments">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Payments</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/certificates">
                    <SidebarMenuButton isActive={isActive("/admin/certificates")} tooltip="Certificates">
                      <Award className="h-4 w-4 mr-2" />
                      <span>Certificates</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/mpesa-settings">
                    <SidebarMenuButton isActive={isActive("/admin/mpesa-settings")} tooltip="M-Pesa Settings">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>M-Pesa Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/gmail-settings">
                    <SidebarMenuButton isActive={isActive("/admin/gmail-settings")} tooltip="Gmail Settings">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Gmail Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link to="/admin/logs">
                    <SidebarMenuButton isActive={isActive("/admin/logs")} tooltip="Activity Logs">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Activity Logs</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <div className="px-4 py-2 text-xs">
              <Link to="/" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                Return to Website
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
