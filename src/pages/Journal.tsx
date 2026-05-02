import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import { usePlaces } from '@/hooks/usePlaces';
import { PageHeader } from '@/components/quest/PageHeader';
import { JournalEmblem } from '@/components/quest/JournalEmblem';

const Journal = () => {
  const { userProgress } = useApp();
  const { data: places } = usePlaces();

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
    <div className="cathedral-rose-bg min-h-screen pb-24">
      <div className="container mx-auto px-4 py-6 pt-6 relative z-10">
        <div className="space-y-6">
          <PageHeader
            emblem={<JournalEmblem size={92} />}
            title="Mon Journal"
            subtitle="lieux sacrés · souvenirs · partages"
          />

          {/* Progression globale + partage */}
          <div className="cg-lead rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Progression</p>
                <p className="text-xs text-white/55">
                  {unlocked} / {total} lieux débloqués
                </p>
              </div>
              <Button onClick={handleShare} variant="ghost" size="sm"
                className="gap-2 shrink-0 border border-amber-300/25 text-amber-200 hover:bg-amber-300/10">
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>

          <SocialTab />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Journal;
