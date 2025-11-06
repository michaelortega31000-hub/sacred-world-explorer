import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';

const Journal = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 pt-8">
        <div className="space-y-6">
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
