import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { CreditsProvider } from "@/contexts/CreditsContext";
import { AmbientSoundProvider } from "@/contexts/AmbientSoundContext";
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
import Referral from "./pages/Referral";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import HowToUse from "./pages/HowToUse";
import NotFound from "./pages/NotFound";
import CognitiveDNAFlow from "./components/onboarding/CognitiveDNAFlow";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading, profile } = useAuth();
  const [showDNA, setShowDNA] = useState(false);
  const [dnaChecked, setDnaChecked] = useState(false);

  useEffect(() => {
    if (!loading && profile) {
      const prefs = profile.preferences as any;
      const hasDNA = prefs?.cognitive_dna;
      setShowDNA(!hasDNA);
      setDnaChecked(true);
    } else if (!loading && !profile) {
      setDnaChecked(true);
    }
  }, [loading, profile]);

  if (loading || !dnaChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (showDNA) {
    return <CognitiveDNAFlow onComplete={() => setShowDNA(false)} />;
  }

  return (
    <ProgressProvider>
      <CreditsProvider>
        <AmbientSoundProvider>
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
              <Route path="/referral" element={<Referral />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/sentences" element={<Placeholder title="Sentences" description="Build and deconstruct sentences across languages. Coming soon." />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AmbientSoundProvider>
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
