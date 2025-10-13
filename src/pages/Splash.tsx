import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.png';
import { supabase } from '@/integrations/supabase/client';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const hasMode = localStorage.getItem('selectedMode');
        if (hasMode) {
          navigate('/selection');
        } else {
          navigate('/mode-selection');
        }
      }
    });
  }, [navigate]);

  const handleClick = () => {
    navigate('/auth');
  };

  return (
    <div 
      className="w-screen h-screen flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleClick}
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0E1B3F 30%, #1a3a52 60%, #0E1B3F 100%)'
      }}
    >
      <img 
        src={splashHero} 
        alt="SacredWorld" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Splash;
