import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/components/auth/LoginPage";
import { RegisterPage } from "@/components/auth/RegisterPage";
import { OnboardingPage } from "@/components/auth/OnboardingPage";
import { AuthCallback } from "@/components/auth/AuthCallback";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import BookSpacePage from "./pages/BookSpacePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AICoachPage from "./pages/AICoachPage";
import SpacesPage from "./pages/SpacesPage";
import NotFound from "./pages/NotFound";
import { FloatingAssistant } from "./components/bookings/FloatingAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/book-space" element={<BookSpacePage />} />
            <Route path="/ai-coach" element={<AICoachPage />} />
            <Route path="/spaces" element={<SpacesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Floating Assistant - available on all pages */}
          <FloatingAssistant />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
