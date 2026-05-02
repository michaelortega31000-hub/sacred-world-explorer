import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SacredEmblem } from '@/components/quest/SacredEmblem';
import { logger } from '@/lib/logger';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    logger.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="cathedral-rose-bg flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <SacredEmblem size={96} />
        </div>
        <h1 className="text-6xl font-cinzel font-bold text-amber-50">404</h1>
        <p className="text-2xl text-amber-200/85">Page non trouvée</p>
        <p className="text-white/60">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="mt-6 bg-gradient-to-r from-amber-300 to-orange-400 text-amber-950 hover:opacity-90 font-semibold"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
