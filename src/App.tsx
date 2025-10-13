import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import "./i18n/config";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import Traditions from "./pages/Traditions";
import Selection from "./pages/Selection";
import ModeSelection from "./pages/ModeSelection";
import WorldMap from "./pages/WorldMap";
import Country from "./pages/Country";
import PlaceDetail from "./pages/PlaceDetail";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/mode-selection" element={<ModeSelection />} />
          <Route path="/traditions" element={<Traditions />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/world" element={<WorldMap />} />
          <Route path="/country/:country" element={<Country />} />
          <Route path="/place/:placeId" element={<PlaceDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
