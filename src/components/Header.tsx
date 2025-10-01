import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.jpg';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
  transparent?: boolean;
}

const Header = ({ showBack = false, backTo = '/', backLabel = 'Retour', children, transparent = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de se déconnecter',
        variant: 'destructive'
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div className={`p-4 ${transparent ? 'bg-transparent' : 'border-b border-border'}`} style={!transparent ? { background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(42 95% 38%) 100%)' } : {}}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
          <Button
            variant="ghost"
            onClick={() => navigate(backTo)}
            className={`gap-2 ${transparent ? 'text-white hover:bg-white/10' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
          )}
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="h-12 w-12 object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        
        <div className="flex items-center gap-4">
          {children}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={`gap-2 ${transparent ? 'text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
