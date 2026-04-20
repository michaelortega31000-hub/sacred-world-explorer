import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAssistant } from "@/App";

const HIDDEN_PATHS = ["/", "/auth", "/welcome", "/onboarding/denomination"];

const FloatingAssistantButton = () => {
  const location = useLocation();
  const { isOpen, setIsOpen } = useAssistant();

  if (HIDDEN_PATHS.includes(location.pathname) || isOpen) {
    return null;
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Assistant Sacred World"
      title="Assistant Sacred World"
      className="fixed top-3 right-3 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary hover:bg-primary/30 transition-colors cursor-pointer"
      style={{
        boxShadow:
          "0 0 18px rgba(244,197,66,0.55), 0 0 36px rgba(244,197,66,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
};

export default FloatingAssistantButton;
