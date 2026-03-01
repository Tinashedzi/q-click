import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Glossa from "./pages/Glossa";
import Delores from "./pages/Delores";
import Oasis from "./pages/Oasis";
import VideoPage from "./pages/Video";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/glossa" element={<Glossa />} />
            <Route path="/delores" element={<Delores />} />
            <Route path="/oasis" element={<Oasis />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/sentences" element={<Placeholder title="Sentences" description="Build and deconstruct sentences across languages. Coming soon." />} />
            <Route path="/forge" element={<Placeholder title="Forge" description="Craft understanding through exercises and challenges. Coming soon." />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
