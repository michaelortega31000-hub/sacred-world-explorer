import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/sacredworld-logo.png';
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
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(52, 224, 161, 0.4) 0%, rgba(52, 224, 161, 0.2) 30%, transparent 60%)',
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-40 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(244, 197, 66, 0.3) 0%, rgba(244, 197, 66, 0.1) 40%, transparent 60%)'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* Logo with intense golden glow */}
        <div className="relative mb-12 animate-fade-in">
          {/* Outer glow rings */}
          <div 
            className="absolute inset-0 rounded-full blur-[100px] animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(244, 197, 66, 0.9) 0%, rgba(244, 197, 66, 0.6) 20%, rgba(52, 224, 161, 0.3) 40%, transparent 60%)',
              transform: 'scale(3.5)',
              animationDuration: '3s'
            }}
          />
          <div 
            className="absolute inset-0 rounded-full blur-[60px]"
            style={{
              background: 'radial-gradient(circle, rgba(244, 197, 66, 1) 0%, rgba(244, 197, 66, 0.7) 25%, rgba(52, 224, 161, 0.4) 45%, transparent 65%)',
              transform: 'scale(2.8)'
            }}
          />
          
          {/* Logo */}
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="h-48 w-48 relative z-10 object-contain"
            style={{
              filter: 'drop-shadow(0 0 60px rgba(244, 197, 66, 1)) drop-shadow(0 0 100px rgba(244, 197, 66, 0.8)) drop-shadow(0 0 140px rgba(52, 224, 161, 0.5))'
            }}
          />
        </div>

        {/* Title */}
        <h1 
          className="font-serif text-foreground mb-6 animate-fade-in"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            letterSpacing: '0.02em',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(52, 224, 161, 0.2)',
            animationDelay: '200ms'
          }}
        >
          SacredWorld
        </h1>

        {/* Subtitle */}
        <p 
          className="text-foreground text-xl md:text-2xl mb-16 font-light animate-fade-in"
          style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            animationDelay: '400ms'
          }}
        >
          Explore. Discover. Connect<br />with the world.
        </p>

        {/* CTA Button with golden border glow */}
        <Button
          onClick={() => navigate('/welcome')}
          size="lg"
          className="relative text-white font-medium text-lg px-12 py-6 rounded-full transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)',
            border: '2px solid rgba(244, 197, 66, 0.8)',
            boxShadow: '0 0 30px rgba(244, 197, 66, 0.6), 0 0 60px rgba(52, 224, 161, 0.4), inset 0 0 20px rgba(244, 197, 66, 0.2)',
            animationDelay: '600ms'
          }}
        >
          Commencer l'exploration
        </Button>

        {/* Language selector */}
        <div className="mt-16 flex items-center gap-2 text-foreground opacity-80 hover:opacity-100 transition-opacity cursor-pointer animate-fade-in"
          style={{
            animationDelay: '800ms'
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
