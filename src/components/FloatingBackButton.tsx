import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HIDDEN_PATHS = ["/", "/auth", "/welcome", "/onboarding/denomination", "/explore"];

const FloatingBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (HIDDEN_PATHS.includes(location.pathname)) {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/explore")}
      aria-label="Retour au globe"
      title="Retour au globe"
      className="fixed top-3 left-3 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary hover:bg-primary/30 transition-colors cursor-pointer"
      style={{
        boxShadow:
          "0 0 18px rgba(244,197,66,0.55), 0 0 36px rgba(244,197,66,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      <ArrowLeft className="w-7 h-7" />
    </button>
  );
};

export default FloatingBackButton;
