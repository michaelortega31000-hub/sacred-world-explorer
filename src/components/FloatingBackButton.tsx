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
      className="fixed top-3 left-3 z-[60] flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary hover:bg-primary/30 transition-colors cursor-pointer"
      style={{
        boxShadow:
          "0 0 10px rgba(244,197,66,0.4), 0 0 20px rgba(244,197,66,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};

export default FloatingBackButton;
