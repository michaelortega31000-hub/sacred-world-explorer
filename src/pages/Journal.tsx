import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';
import { BackButton } from '@/components/BackButton';
import { ImageBackground } from '@/components/ImageBackground';
import { useApp } from '@/contexts/AppContext';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';

const Journal = () => {
  const navigate = useNavigate();
  const { userProgress } = useApp();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative">
        <BackButton />
        
        <div className="container mx-auto px-4 py-6 pt-16 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon Espace Social
              </h1>
              <p className="text-lg text-muted-foreground">
                Souvenirs, amis, messages et discussions
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <SocialTab />
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ImageBackground>
  );
};

export default Journal;
