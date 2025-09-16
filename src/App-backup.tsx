import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Credits from "./pages/Credits";
import TeacherLessons from "./pages/TeacherLessons";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ClassCatalog from "./pages/ClassCatalog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/catalog" element={<Layout><ClassCatalog /></Layout>} />
          <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
          <Route path="/forum" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl font-bold">Fórum - Em Desenvolvimento</h1></div></Layout>} />
          <Route path="/ai-chat" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl font-bold">Chat IA - Em Desenvolvimento</h1></div></Layout>} />
          <Route path="/credits" element={<Layout><Credits /></Layout>} />
          <Route path="/teaching" element={<Layout><TeacherLessons /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;