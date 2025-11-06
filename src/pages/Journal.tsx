import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Journal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-32 mb-6 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 gap-1 opacity-20">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-full h-full bg-primary/20" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>
      
      <div className="container mx-auto px-4 py-6 pt-2">
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'exploration
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mon Espace Social
            </h1>
            <p className="text-lg text-muted-foreground">
              Souvenirs, amis, messages et discussions
            </p>
          </div>

          <SocialTab />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Journal;
