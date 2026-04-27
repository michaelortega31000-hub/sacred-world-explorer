import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from '@/assets/sacredworld-logo-official.png';
import { logger } from '@/lib/logger';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    logger.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-2xl text-muted-foreground">Page non trouvée</p>
        <p className="text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-6"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
