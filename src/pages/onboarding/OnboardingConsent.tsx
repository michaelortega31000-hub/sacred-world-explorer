import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { OnboardingLayout } from './OnboardingLayout';

const OnboardingConsent = () => {
  const navigate = useNavigate();
  const { session, refreshProfile } = useApp();
  const [checkin, setCheckin] = useState(true);
  const [friends, setFriends] = useState(false);
  const [communityMap, setCommunityMap] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const finish = async () => {
    if (!session?.user) return;
    setSubmitting(true);
    const ts = new Date().toISOString();
    const consents = {
      version: 1,
      geolocation_checkin: { granted: checkin, ts },
      geolocation_friends: { granted: friends, ts },
      community_map: { granted: communityMap, ts },
    };
    await supabase.from('profiles').update({ consents }).eq('id', session.user.id);
    await refreshProfile();
    setSubmitting(false);
    navigate('/onboarding/tutorial');
  };

  return (
    <OnboardingLayout
      step={3}
      title="Vos préférences de confidentialité"
      subtitle="Chaque option est indépendante et révocable à tout moment dans Réglages."
    >
      <Card className="bg-sacred-blue/70 border-primary/30 p-4 backdrop-blur-md shadow-lg space-y-4">
        <ConsentRow
          title="Géolocalisation pour les check-ins"
          description="Nécessaire pour valider que vous êtes physiquement sur place. Votre position n'est lue qu'au moment du check-in."
          checked={checkin}
          onChange={setCheckin}
        />
        <ConsentRow
          title="Partager ma position avec mes amis"
          description="Vos amis peuvent voir votre position approximative. Désactivé par défaut."
          checked={friends}
          onChange={setFriends}
        />
        <ConsentRow
          title="Apparaître sur la carte communautaire"
          description="Votre profil apparaîtra sur la carte de votre tradition. Désactivé par défaut."
          checked={communityMap}
          onChange={setCommunityMap}
        />
      </Card>

      <Button
        onClick={finish}
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)] mt-2"
      >
        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Continuer
      </Button>

      <p className="text-[11px] text-white/50 text-center mt-2 px-2">
        Pour comprendre comment vos données sont utilisées, lisez{' '}
        <a href="/PRIVACY.md" className="underline" target="_blank" rel="noreferrer">
          notre politique de confidentialité
        </a>
        .
      </p>
    </OnboardingLayout>
  );
};

const ConsentRow = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-white leading-tight">{title}</h4>
      <p className="text-[11px] text-white/65 leading-snug mt-0.5">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} className="mt-1" />
  </div>
);

export default OnboardingConsent;
