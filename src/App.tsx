import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Credits from "./pages/Credits";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import TeacherLessons from "./pages/TeacherLessons";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ClassCatalog from "./pages/ClassCatalog";
import Forum from "./pages/Forum";
import AIChat from "./pages/AIChat";
import Learning from "./pages/Learning";

const queryClient = new QueryClient();

const App = () => {
  console.log('Escola Inglês Pareto - Full App loading...');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/catalog" element={
                <ProtectedRoute>
                  <Layout><ClassCatalog /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Layout><Schedule /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/learning" element={
                <ProtectedRoute>
                  <Layout><Learning /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/forum" element={
                <ProtectedRoute>
                  <Layout><Forum /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/ai-chat" element={
                <ProtectedRoute>
                  <Layout><AIChat /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/credits" element={
                <ProtectedRoute>
                  <Layout><Credits /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Layout><Checkout /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/payment/success" element={
                <ProtectedRoute>
                  <Layout><PaymentSuccess /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/payment/failure" element={
                <ProtectedRoute>
                  <Layout><PaymentFailure /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/teaching" element={
                <ProtectedRoute requiredRole="teacher">
                  <Layout><TeacherLessons /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><Admin /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={
                <ProtectedRoute>
                  <Layout><NotFound /></Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;