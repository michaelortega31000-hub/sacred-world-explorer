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
      className="fixed top-3 right-3 z-[60] flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary hover:bg-primary/30 transition-colors cursor-pointer"
      style={{
        boxShadow:
          "0 0 10px rgba(244,197,66,0.4), 0 0 20px rgba(244,197,66,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      <MessageCircle className="w-5 h-5" />
    </button>
  );
};

export default FloatingAssistantButton;
