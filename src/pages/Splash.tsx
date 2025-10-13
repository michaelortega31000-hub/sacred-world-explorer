import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.png';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Si connecté, vérifier s'il a choisi un mode
        const hasMode = localStorage.getItem('selectedMode');
        if (hasMode) {
          navigate('/selection');
        } else {
          navigate('/mode-selection');
        }
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0E1B3F 30%, #1a3a52 60%, #0E1B3F 100%)'
      }}
    >
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* Hero image from your mockup */}
        <div className="mb-12 animate-fade-in">
          <img 
            src={splashHero} 
            alt="SacredWorld" 
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* CTA Button with golden border glow */}
        <Button
          onClick={() => navigate('/welcome')}
          size="lg"
          className="relative text-white font-medium text-lg px-12 py-6 rounded-full transition-all duration-300 hover:scale-105 animate-fade-in mb-16"
          style={{
            background: 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)',
            border: '2px solid rgba(244, 197, 66, 0.8)',
            boxShadow: '0 0 30px rgba(244, 197, 66, 0.6), 0 0 60px rgba(52, 224, 161, 0.4), inset 0 0 20px rgba(244, 197, 66, 0.2)',
            animationDelay: '400ms'
          }}
        >
          Commencer l'exploration
        </Button>

        {/* Language selector */}
        <div className="flex items-center gap-2 text-foreground opacity-80 hover:opacity-100 transition-opacity cursor-pointer animate-fade-in"
          style={{
            animationDelay: '600ms'
          }}
        >
          <Globe className="w-5 h-5" />
          <span className="text-lg">Français</span>
        </div>
      </div>
    </div>
  );
};

export default Splash;
