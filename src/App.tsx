import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import "./i18n/config";
import AssistantChat from "./components/AssistantChat";
import FloatingAssistantButton from "./components/FloatingAssistantButton";
import FloatingBackButton from "./components/FloatingBackButton";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import HomeQuest from "./pages/HomeQuest";
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
import ChangeDenomination from "./pages/ChangeDenomination";
import OnboardingDenomination from "./pages/onboarding/OnboardingDenomination";
import OnboardingHome from "./pages/onboarding/OnboardingHome";
import OnboardingConsent from "./pages/onboarding/OnboardingConsent";
import OnboardingTutorial from "./pages/onboarding/OnboardingTutorial";
import Planner from "./pages/Planner";
import LogoIterations from "./pages/LogoIterations";
import { RequireAuth } from "./components/RequireAuth";
import { RequireOnboarding } from "./components/RequireOnboarding";

const isDev = import.meta.env.DEV;
const Gate = ({ children }: { children: JSX.Element }) => (
  <RequireAuth>
    <RequireOnboarding>{children}</RequireOnboarding>
  </RequireAuth>
);

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
        
        <FloatingBackButton />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/logo-iterations" element={<LogoIterations />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Gate><HomeQuest /></Gate>} />
          <Route path="/places" element={<Gate><Places /></Gate>} />
          <Route path="/explore" element={<Gate><Explore /></Gate>} />
          <Route path="/traditions" element={<Gate><Traditions /></Gate>} />
          <Route path="/calendar" element={<Gate><Calendar /></Gate>} />
          <Route path="/journal" element={<Gate><Journal /></Gate>} />
          <Route path="/profile" element={<Gate><Profile /></Gate>} />
          <Route path="/settings" element={<Gate><Settings /></Gate>} />
          <Route path="/settings/change-denomination" element={<Gate><ChangeDenomination /></Gate>} />
          <Route path="/badges" element={<Gate><Badges /></Gate>} />
          <Route path="/avatars" element={<Gate><AvatarsGallery /></Gate>} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/user/:userId" element={<Gate><UserProfile /></Gate>} />
          <Route path="/country/:countryName" element={<Gate><Country /></Gate>} />
          <Route path="/place/:placeId" element={<Gate><PlaceDetail /></Gate>} />
          <Route path="/admin" element={<Gate><Admin /></Gate>} />
          <Route path="/admin/dashboard" element={<Gate><AdminDashboard /></Gate>} />
          <Route path="/admin/enrich-data" element={<Gate><AdminEnrichData /></Gate>} />
          <Route path="/admin/audit-images" element={<Gate><AdminAuditImages /></Gate>} />
          <Route path="/reminders" element={<Gate><Reminders /></Gate>} />
          {isDev && <Route path="/security-test" element={<SecurityTest />} />}
          <Route path="/offline" element={<Gate><OfflineManager /></Gate>} />

          {/* Onboarding flow — auth required, but NOT onboarding-required */}
          <Route path="/onboarding/denomination" element={<RequireAuth><OnboardingDenomination /></RequireAuth>} />
          <Route path="/onboarding/home" element={<RequireAuth><OnboardingHome /></RequireAuth>} />
          <Route path="/onboarding/consent" element={<RequireAuth><OnboardingConsent /></RequireAuth>} />
          <Route path="/onboarding/tutorial" element={<RequireAuth><OnboardingTutorial /></RequireAuth>} />

          <Route path="/planner" element={<Gate><Planner /></Gate>} />

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
