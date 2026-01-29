import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import "./i18n/config";
import AssistantChat from "./components/AssistantChat";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Explore from "./pages/Explore";
import Traditions from "./pages/Traditions";
import Calendar from "./pages/Calendar";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import Country from "./pages/Country";
import PlaceDetail from "./pages/PlaceDetail";
import Badges from "./pages/Badges";
import UserProfile from "./pages/UserProfile";
import AvatarsGallery from "./pages/AvatarsGallery";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Reminders from "./pages/Reminders";
import SecurityTest from "./pages/SecurityTest";

const queryClient = new QueryClient();

// Wrapper component to conditionally render AssistantChat
const AssistantWrapper = () => {
  const location = useLocation();
  const hiddenPaths = ["/", "/auth"];
  
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }
  
  return <AssistantChat />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AssistantWrapper />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/traditions" element={<Traditions />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/avatars" element={<AvatarsGallery />} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/country/:countryName" element={<Country />} />
          <Route path="/place/:placeId" element={<PlaceDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/security-test" element={<SecurityTest />} />

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
