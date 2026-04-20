import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';
import { BackButton } from '@/components/BackButton';
import { ImageBackground } from '@/components/ImageBackground';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import { usePlaces } from '@/hooks/usePlaces';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';

const Journal = () => {
  const { userProgress } = useApp();
  const { data: places } = usePlaces();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);

  const total = places?.length ?? 0;
  const unlocked = userProgress.visitedPlaces?.length ?? 0;
  const pct = total > 0 ? Math.min(100, Math.round((unlocked / total) * 100)) : 0;

  const handleShare = async () => {
    const shareText = `J'ai débloqué ${unlocked} lieu${unlocked > 1 ? 'x' : ''} sacré${unlocked > 1 ? 's' : ''} sur SacredWorld 🙏`;
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({
          title: 'Ma Collection — SacredWorld',
          text: shareText,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`.trim());
      toast.success('Lien copié dans le presse-papiers');
    } catch {
      // Silent — user likely cancelled
    }
  };

  return (
    <ImageBackground
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative">
        <div className="container mx-auto px-4 py-6 pt-16 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ma Collection
              </h1>
              <p className="text-lg text-muted-foreground">
                Vos lieux sacrés débloqués, souvenirs et partages
              </p>
            </div>

            {/* Progression globale + partage */}
            <div className="rounded-xl border border-border/60 bg-background/70 backdrop-blur-md p-4 space-y-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Progression</p>
                  <p className="text-xs text-muted-foreground">
                    {unlocked} / {total} lieux débloqués
                  </p>
                </div>
                <Button onClick={handleShare} variant="outline" size="sm" className="gap-2 shrink-0">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>
              <Progress value={pct} className="h-2" />
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
