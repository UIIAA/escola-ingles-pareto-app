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
import Forum from "./pages/Forum";
import AIChat from "./pages/AIChat";
import Learning from "./pages/Learning";
import AdminUsers from "./pages/AdminUsers";
import AdminFinance from "./pages/AdminFinance";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import AdminTeachers from "./pages/AdminTeachers";
import AdminLessons from "./pages/AdminLessons";
import AdminPayments from "./pages/AdminPayments";
import AdminReports from "./pages/AdminReports";
import PaymentHistory from "./pages/PaymentHistory";
import TeacherStudents from "./pages/TeacherStudents";

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
                <ProtectedRoute requiredRole="student">
                  <Layout><AIChat /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/credits" element={
                <ProtectedRoute requiredRole="student">
                  <Layout><Credits /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments/history" element={
                <ProtectedRoute requiredRole="student">
                  <Layout><PaymentHistory /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute requiredRole="student">
                  <Layout><Checkout /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/payment/success" element={
                <ProtectedRoute requiredRole="student">
                  <Layout><PaymentSuccess /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/payment/failure" element={
                <ProtectedRoute requiredRole="student">
                  <Layout><PaymentFailure /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/teaching" element={
                <ProtectedRoute requiredRole="teacher">
                  <Layout><TeacherLessons /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/teaching/students" element={
                <ProtectedRoute requiredRole="teacher">
                  <Layout><TeacherStudents /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><Admin /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminUsers /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/finance" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminFinance /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminAnalytics /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminSettings /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/teachers" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminTeachers /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/lessons" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminLessons /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminPayments /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requiredRole="master">
                  <Layout><AdminReports /></Layout>
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