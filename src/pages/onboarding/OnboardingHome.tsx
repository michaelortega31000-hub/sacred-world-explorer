import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { OnboardingLayout } from './OnboardingLayout';

const OnboardingHome = () => {
  const navigate = useNavigate();
  const { session, refreshProfile } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCurrentLocation = () => {
    if (!session?.user) return;
    if (!navigator.geolocation) {
      setError("Votre navigateur ne fournit pas la géolocalisation.");
      return;
    }
    setSubmitting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Stored as PostGIS WKT — keeps round-trip simple via PostgREST.
        const wkt = `SRID=4326;POINT(${pos.coords.longitude} ${pos.coords.latitude})`;
        const { error } = await supabase
          .from('profiles')
          .update({
            home_location: wkt,
            home_location_set_at: new Date().toISOString(),
          })
          .eq('id', session.user.id);
        if (error) {
          setError("Impossible d'enregistrer votre position.");
        } else {
          await refreshProfile();
        }
        setSubmitting(false);
        navigate('/onboarding/consent');
      },
      (err) => {
        setError(err.message || 'Permission refusée.');
        setSubmitting(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const skip = () => navigate('/onboarding/consent');

  return (
    <OnboardingLayout
      step={2}
      title="Définir votre point d'attache"
      subtitle="Votre position de référence sert à calculer la valeur de vos voyages. Vous pouvez la définir plus tard."
    >
      <Card className="bg-sacred-blue/70 border-primary/30 p-4 backdrop-blur-md shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base text-white leading-tight mb-1">
              Position de référence
            </h3>
            <p className="text-xs text-white/70 leading-snug">
              Plus vous voyagerez loin de ce point, plus vos check-ins rapporteront de points.
              Stocké de manière sécurisée et modifiable à tout moment dans Réglages.
            </p>
          </div>
        </div>

        <Button
          onClick={useCurrentLocation}
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2" />
          )}
          Utiliser ma position actuelle
        </Button>

        {error && <p className="text-xs text-red-300 mt-2">{error}</p>}
      </Card>

      <Button
        variant="ghost"
        onClick={skip}
        className="text-white/60 hover:text-white hover:bg-white/10 text-sm mt-2"
      >
        Plus tard
      </Button>
    </OnboardingLayout>
  );
};

export default OnboardingHome;
