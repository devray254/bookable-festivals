
import React from "react";
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
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminCategories from "./pages/admin/Categories";
import AdminBookings from "./pages/admin/Bookings";
import AdminPayments from "./pages/admin/Payments";
import AdminLogs from "./pages/admin/Logs";
import AdminUsers from "./pages/admin/Users";
import AdminCertificates from "./pages/admin/Certificates";
import MpesaSettings from "./pages/admin/MpesaSettings";
import SiteSettings from "./pages/admin/SiteSettings";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import VirtualAcademy from "./pages/VirtualAcademy";

// Create a function to get a new query client instance
// This ensures a fresh QueryClient is created for each render
const App: React.FC = () => {
  // Initialize the query client inside the component
  const queryClient = new QueryClient();
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/virtual-academy" element={<VirtualAcademy />} />
              
              {/* Admin Routes */}
              <Route path="/admin-portal" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/admin/mpesa-settings" element={<MpesaSettings />} />
              <Route path="/admin/site-settings" element={<SiteSettings />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
