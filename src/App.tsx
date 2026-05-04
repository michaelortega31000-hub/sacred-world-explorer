import { useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import "./i18n/config";
import AssistantChat from "./components/AssistantChat";
import FloatingBackButton from "./components/FloatingBackButton";
// Eager pages — fast first paint paths
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import { RequireAuth } from "./components/RequireAuth";
import { RequireOnboarding } from "./components/RequireOnboarding";

// Lazy pages — loaded on demand to keep the splash boot fast
const HomeQuest = lazy(() => import("./pages/HomeQuest"));
const Places = lazy(() => import("./pages/Places"));
const Explore = lazy(() => import("./pages/Explore"));
const Traditions = lazy(() => import("./pages/Traditions"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Journal = lazy(() => import("./pages/Journal"));
const Profile = lazy(() => import("./pages/Profile"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const Country = lazy(() => import("./pages/Country"));
const PlaceDetail = lazy(() => import("./pages/PlaceDetail"));
const Badges = lazy(() => import("./pages/Badges"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AvatarsGallery = lazy(() => import("./pages/AvatarsGallery"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminEnrichData = lazy(() => import("./pages/AdminEnrichData"));
const AdminAuditImages = lazy(() => import("./pages/AdminAuditImages"));
const Reminders = lazy(() => import("./pages/Reminders"));
const SecurityTest = lazy(() => import("./pages/SecurityTest"));
const OfflineManager = lazy(() => import("./pages/OfflineManager"));
const ChangeDenomination = lazy(() => import("./pages/ChangeDenomination"));
const OnboardingDenomination = lazy(() => import("./pages/onboarding/OnboardingDenomination"));
const OnboardingHome = lazy(() => import("./pages/onboarding/OnboardingHome"));
const OnboardingConsent = lazy(() => import("./pages/onboarding/OnboardingConsent"));
const OnboardingTutorial = lazy(() => import("./pages/onboarding/OnboardingTutorial"));
const Planner = lazy(() => import("./pages/Planner"));
const LogoIterations = lazy(() => import("./pages/LogoIterations"));

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

const RouteFallback = () => (
  <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground">
    <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const AppContent = () => {
  const [assistantOpen, setAssistantOpen] = useState(false);
  
  return (
    <AssistantContext.Provider value={{ isOpen: assistantOpen, setIsOpen: setAssistantOpen }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AssistantWrapper isOpen={assistantOpen} setIsOpen={setAssistantOpen} />
        
        <FloatingBackButton />
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
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
