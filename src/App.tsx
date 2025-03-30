
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Organizers from "./pages/Organizers";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminCategories from "./pages/admin/Categories";
import AdminBookings from "./pages/admin/Bookings";
import AdminPayments from "./pages/admin/Payments";
import AdminLogs from "./pages/admin/Logs";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organizers" element={<Organizers />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* Admin Routes */}
          <Route path="/admin-portal" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
