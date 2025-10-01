import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-6">
      <div className="text-center animate-fade-in">
        <div className="mb-8 flex justify-center">
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="w-32 h-32 md:w-40 md:h-40 animate-float"
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
          SacredWorld
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 font-light">
          {isLoading ? t('splash.loading') : 'Découvrez les trésors sacrés du monde'}
        </p>

        {!isLoading && (
          <Button 
            size="lg"
            onClick={() => navigate('/selection')}
            className="bg-card text-card-foreground hover:bg-card/90 px-8 py-6 text-lg rounded-full animate-scale-in shadow-lg hover:shadow-xl transition-all"
          >
            {t('splash.start')}
          </Button>
        )}

        {isLoading && (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Splash;
