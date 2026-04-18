import { useState } from "react";
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
import Home from "./pages/Home";
import Places from "./pages/Places";
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
import AdminEnrichData from "./pages/AdminEnrichData";
import AdminAuditImages from "./pages/AdminAuditImages";
import Reminders from "./pages/Reminders";
import SecurityTest from "./pages/SecurityTest";
import OfflineManager from "./pages/OfflineManager";
import OnboardingDenomination from "./pages/OnboardingDenomination";

const queryClient = new QueryClient();

// Create a context for the assistant
import { createContext, useContext } from "react";

interface AssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AssistantContext = createContext<AssistantContextType | null>(null);

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }
  return context;
};

// Wrapper component to conditionally render AssistantChat
const AssistantWrapper = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const location = useLocation();
  const hiddenPaths = ["/", "/auth"];
  
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }
  
  return <AssistantChat isOpen={isOpen} onOpenChange={setIsOpen} />;
};

const AppContent = () => {
  const [assistantOpen, setAssistantOpen] = useState(false);
  
  return (
    <AssistantContext.Provider value={{ isOpen: assistantOpen, setIsOpen: setAssistantOpen }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AssistantWrapper isOpen={assistantOpen} setIsOpen={setAssistantOpen} />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/places" element={<Places />} />
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
          <Route path="/admin/enrich-data" element={<AdminEnrichData />} />
          <Route path="/admin/audit-images" element={<AdminAuditImages />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/security-test" element={<SecurityTest />} />
          <Route path="/offline" element={<OfflineManager />} />
          <Route path="/onboarding/denomination" element={<OnboardingDenomination />} />

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
    </AssistantContext.Provider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </QueryClientProvider>
);

export default App;
