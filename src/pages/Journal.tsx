import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Journal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 pt-8">
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
