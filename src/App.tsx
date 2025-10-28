import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import "./i18n/config";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Explore from "./pages/Explore";
import Traditions from "./pages/Traditions";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Country from "./pages/Country";
import PlaceDetail from "./pages/PlaceDetail";
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
          <Route path="/explore" element={<Explore />} />
          <Route path="/traditions" element={<Traditions />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/country/:countryName" element={<Country />} />
          <Route path="/place/:placeId" element={<PlaceDetail />} />

          {/* Legacy paths redirects */}
          <Route path="/world" element={<Navigate to="/explore" replace />} />
          <Route path="/world/*" element={<Navigate to="/explore" replace />} />
          <Route path="/mode-selection" element={<Navigate to="/welcome" replace />} />
          <Route path="/selection" element={<Navigate to="/welcome" replace />} />
          <Route path="/community" element={<Navigate to="/journal" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
