import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RouteComparison from "./pages/RouteComparison";
import RoutePlanning from "./pages/RoutePlanning";
import GreenMilesDashboard from "./pages/GreenMilesDashboard";
import SmartRedirection from "./pages/SmartRedirection";
import Leaderboard from "./pages/Leaderboard";
import Redemption from "./pages/Redemption";
import ARExperience from "./pages/ARExperience";
import CameraTest from "./pages/CameraTest";
import CheckIn from "./pages/CheckIn";
import LocalExplorer from "./pages/LocalExplorer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/routes" element={<RouteComparison />} />
          <Route path="/route-planning" element={<RoutePlanning />} />
          <Route path="/green-miles" element={<GreenMilesDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/redemption" element={<Redemption />} />
          <Route path="/ar-experience" element={<ARExperience />} />
          <Route path="/camera-test" element={<CameraTest />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/local-explorer" element={<LocalExplorer />} />
          <Route path="/traffic" element={<SmartRedirection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
