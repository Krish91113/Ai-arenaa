import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PlaygroundSection } from "@/components/landing/PlaygroundSection";
import { HistorySection } from "@/components/landing/HistorySection";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import PlaygroundPage from "@/pages/PlaygroundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <Features />
                <HowItWorks />
                <PlaygroundSection />
                <HistorySection />
                <FAQ />
              </main>
            }
          />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
        <Footer />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;