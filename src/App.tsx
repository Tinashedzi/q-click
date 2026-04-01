import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { CreditsProvider } from "@/contexts/CreditsContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Glossa from "./pages/Glossa";
import Delores from "./pages/Delores";
import Oasis from "./pages/Oasis";
import VideoPage from "./pages/Video";
import Forge from "./pages/Forge";
import Gamification from "./pages/Gamification";
import Library from "./pages/Library";
import Pricing from "./pages/Pricing";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <ProgressProvider>
      <CreditsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/glossa" element={<Glossa />} />
            <Route path="/delores" element={<Delores />} />
            <Route path="/oasis" element={<Oasis />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/forge" element={<Forge />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/library" element={<Library />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/sentences" element={<Placeholder title="Sentences" description="Build and deconstruct sentences across languages. Coming soon." />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CreditsProvider>
    </ProgressProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
