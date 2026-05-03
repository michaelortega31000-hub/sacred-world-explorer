import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

// Granular consent toggles + location-history erasure.
// Mirrors the onboarding consent step; this is the revocation surface.
export const PrivacyConsentCard = () => {
  const ctx = useApp() as any;
  const { session, userProgress } = useApp();
  const refreshProfile: () => Promise<void> = ctx.refreshProfile ?? (async () => {});
  const [busy, setBusy] = useState<string | null>(null);

  const consents = (userProgress as any).consents as
    | Record<string, { granted: boolean; ts: string } | undefined>
    | undefined;
  const get = (k: 'geolocation_checkin' | 'geolocation_friends' | 'community_map') =>
    consents?.[k]?.granted ?? false;

  const setOne = async (
    k: 'geolocation_checkin' | 'geolocation_friends' | 'community_map',
    v: boolean,
  ) => {
    if (!session?.user) return;
    setBusy(k);
    const next = {
      ...(consents ?? { version: 1 }),
      version: 1,
      [k]: { granted: v, ts: new Date().toISOString() },
    };
    const { error } = await supabase
      .from('profiles')
      .update({ consents: next } as any)
      .eq('id', session.user.id);
    if (error) {
      toast.error('Impossible de mettre à jour cette préférence.');
    } else {
      await refreshProfile();
    }
    setBusy(null);
  };

  const eraseLocation = async () => {
    if (!confirm(
      "Effacer définitivement votre historique de localisation ?\n\n" +
      "Vos coordonnées et check-ins seront supprimés. Vos points et badges acquis " +
      "sont conservés."
    )) return;
    setBusy('erase');
    const { error } = await supabase.rpc('erase_my_location_history' as any);
    if (error) {
      toast.error("Impossible d'effacer maintenant. Réessayez plus tard.");
    } else {
      toast.success('Historique de localisation effacé.');
      await refreshProfile();
    }
    setBusy(null);
  };

  return (
    <Card className="p-6 bg-card border-border space-y-5">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Confidentialité &amp; consentements</h3>
      </div>

      <Row
        title="Géolocalisation pour les check-ins"
        description="Lue uniquement au moment d'un check-in pour valider votre présence."
        checked={get('geolocation_checkin')}
        onChange={v => setOne('geolocation_checkin', v)}
        loading={busy === 'geolocation_checkin'}
      />
      <Row
        title="Partager ma position avec mes amis"
        description="Position approximative seulement. Désactivable à tout moment."
        checked={get('geolocation_friends')}
        onChange={v => setOne('geolocation_friends', v)}
        loading={busy === 'geolocation_friends'}
      />
      <Row
        title="Apparaître sur la carte communautaire"
        description="Votre profil peut apparaître sur la carte de votre tradition."
        checked={get('community_map')}
        onChange={v => setOne('community_map', v)}
        loading={busy === 'community_map'}
      />

      <div className="pt-3 border-t border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium">Effacer mon historique de localisation</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Supprime coordonnées, check-ins et position de référence. Vos points et badges
              acquis sont conservés.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={eraseLocation}
            disabled={busy === 'erase'}
          >
            {busy === 'erase' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Effacer
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Politique de confidentialité complète : <a href="/PRIVACY.md" className="underline">PRIVACY.md</a>
      </p>
    </Card>
  );
};

const Row = ({
  title,
  description,
  checked,
  onChange,
  loading,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  loading: boolean;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium leading-tight">{title}</h4>
      <p className="text-xs text-muted-foreground leading-snug mt-0.5">{description}</p>
    </div>
    {loading ? (
      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin mt-1" />
    ) : (
      <Switch checked={checked} onCheckedChange={onChange} className="mt-1" />
    )}
  </div>
);
