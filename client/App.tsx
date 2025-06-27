import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RouteComparison from "./pages/RouteComparison";
<<<<<<< HEAD
import RoutePlanning from "./pages/RoutePlanning";
import GreenMilesDashboard from "./pages/GreenMilesDashboard";
=======
import SmartRedirection from "./pages/SmartRedirection";
>>>>>>> d253adcb5e5f93d2eb815fd5ca364b17ebb1ecfa
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
<<<<<<< HEAD
          <Route path="/route-planning" element={<RoutePlanning />} />
          <Route path="/green-miles" element={<GreenMilesDashboard />} />
=======
          <Route path="/traffic" element={<SmartRedirection />} />
>>>>>>> d253adcb5e5f93d2eb815fd5ca364b17ebb1ecfa
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
