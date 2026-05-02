import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, RotateCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

// Dev-only quick actions surfaced in Settings. import.meta.env.DEV gates the
// whole card so it never ships to production.
export const DevToolsCard = () => {
  const navigate = useNavigate();
  const { session, refreshProfile } = useApp();

  if (!import.meta.env.DEV) return null;

  const resetOnboarding = async () => {
    if (!session?.user) return;
    // Clears denomination_id + onboarded_at so RequireOnboarding bounces
    // through the 4-step flow on next nav. Best-effort; works once migrations
    // are pushed. Pre-migration: nulls localStorage flag and forces refresh.
    await supabase
      .from('profiles' as any)
      .update({ denomination_id: null, onboarded_at: null })
      .eq('id', session.user.id);
    localStorage.removeItem('sacredworld_progress');
    await refreshProfile();
    toast.success('Onboarding réinitialisé.');
    navigate('/onboarding/denomination');
  };

  return (
    <Card className="p-6 bg-amber-500/5 border-amber-500/30 space-y-4">
      <div className="flex items-center gap-2 text-amber-200">
        <Wrench className="w-4 h-4" />
        <h3 className="font-semibold text-sm">Outils développeur</h3>
        <span className="text-[10px] text-amber-300/70 ml-auto uppercase tracking-wider">DEV ONLY</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={resetOnboarding} className="border-amber-500/40">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset onboarding
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/home')} className="border-amber-500/40">
          <Sparkles className="w-4 h-4 mr-2" /> Quest Hub
        </Button>
      </div>
      <p className="text-[11px] text-amber-300/60">
        Ces actions ne sont visibles qu'en mode développement.
      </p>
    </Card>
  );
};
