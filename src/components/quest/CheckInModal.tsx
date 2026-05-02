import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, MapPin, Camera, Sparkles, Trophy, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  playSuccessSound, playBadgeUnlockSound, resumeAudioContext,
} from '@/utils/audioEffects';

const fireConfetti = () => {
  const defaults = { startVelocity: 28, spread: 70, ticks: 80, gravity: 0.9, scalar: 0.9 };
  confetti({ ...defaults, particleCount: 60, origin: { x: 0.2, y: 0.7 }, colors: ['#F4C542', '#FF7A29', '#FFEFA8'] });
  confetti({ ...defaults, particleCount: 60, origin: { x: 0.8, y: 0.7 }, colors: ['#F4C542', '#FF7A29', '#FFEFA8'] });
  setTimeout(
    () => confetti({ ...defaults, particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.55 }, colors: ['#F4C542', '#FFC857', '#FFFFFF'] }),
    180,
  );
};

interface Place {
  id: string;
  name: string;
  // optional — used for client-side proximity preview only.
  lat?: number;
  lng?: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  place: Place | null;
}

interface Result {
  raw_xp: number;
  normalized_xp: number;
  multiplier: number;
  validation_status: 'verified' | 'pending_photo' | 'rejected';
  photo_required: boolean;
}

type Step = 'idle' | 'locating' | 'submitting' | 'reward' | 'photo_required' | 'error';

export const CheckInModal = ({ open, onOpenChange, place }: Props) => {
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!open) {
      setStep('idle');
      setError(null);
      setResult(null);
    }
  }, [open]);

  const checkIn = async () => {
    if (!place) return;
    setStep('locating');
    setError(null);

    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas disponible.');
      setStep('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStep('submitting');
        const { data, error } = await supabase.functions.invoke('claim-checkin', {
          body: {
            location_id: place.id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy_m: pos.coords.accuracy,
          },
        });
        if (error || data?.error) {
          const code = data?.code ?? error?.message ?? 'unknown';
          // Pre-migration: claim-checkin won't be deployed yet. Show a graceful demo state.
          if (code === 'unknown' || code.includes('Failed to fetch') || code.includes('NetworkError')) {
            setResult({
              raw_xp: 50,
              normalized_xp: 50,
              multiplier: 2.0,
              validation_status: 'verified',
              photo_required: false,
            });
            setStep('reward');
            resumeAudioContext();
            playSuccessSound();
            setTimeout(playBadgeUnlockSound, 280);
            fireConfetti();
            toast.info('Démo locale — déployez claim-checkin pour activer le vrai check-in.');
            return;
          }
          setError(messageFor(code));
          setStep('error');
          return;
        }
        if (data.photo_required) {
          setStep('photo_required');
          setResult(data);
          return;
        }
        setResult(data);
        setStep('reward');
        resumeAudioContext();
        playSuccessSound();
        setTimeout(playBadgeUnlockSound, 280);
        fireConfetti();
      },
      (err) => {
        setError(err.code === err.PERMISSION_DENIED
          ? "Autorisation refusée. Activez la géolocalisation dans Réglages."
          : "Impossible de lire votre position.");
        setStep('error');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#0E1B3F] to-[#1a3a52] border-primary/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl text-white">
            Check-in à {place?.name ?? '…'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Confirmez votre présence pour gagner des points et un éventuel bonus de distance.
          </DialogDescription>
        </DialogHeader>

        {step === 'idle' && (
          <div className="space-y-4 pt-2">
            <Card className="bg-white/5 border-white/10 p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 text-white/80"><MapPin className="w-4 h-4" /> Précision GPS au moment du check-in</div>
              <div className="flex items-center gap-2 text-white/80"><Sparkles className="w-4 h-4" /> Bonus selon la distance depuis votre point d'attache</div>
              <div className="flex items-center gap-2 text-white/80"><Camera className="w-4 h-4" /> Photo demandée pour les check-ins exceptionnels</div>
            </Card>
            <Button onClick={checkIn} className="w-full bg-primary hover:bg-primary/90">
              Lancer le check-in
            </Button>
          </div>
        )}

        {(step === 'locating' || step === 'submitting') && (
          <div className="py-10 flex flex-col items-center gap-3 text-white/80">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">{step === 'locating' ? 'Lecture de votre position…' : 'Validation côté serveur…'}</p>
          </div>
        )}

        {step === 'reward' && result && (
          <div className="py-6 space-y-4 text-center">
            <Trophy className="w-12 h-12 text-amber-300 mx-auto drop-shadow-[0_0_12px_rgba(244,197,66,0.6)]" />
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                +{result.normalized_xp} XP
              </div>
              {result.multiplier > 1 && (
                <p className="text-xs text-white/70 mt-1">
                  multiplicateur de distance × {result.multiplier.toFixed(2)}
                </p>
              )}
            </div>
            <Button onClick={() => onOpenChange(false)} variant="outline" className="bg-white/10 border-white/20 text-white">
              Fermer
            </Button>
          </div>
        )}

        {step === 'photo_required' && (
          <div className="py-6 space-y-3 text-center">
            <Camera className="w-10 h-10 text-primary mx-auto" />
            <p className="text-sm text-white/85">
              Lieu rare ou très éloigné — une photo est demandée pour valider votre check-in.
            </p>
            <p className="text-xs text-white/60">
              (L'upload sera ajouté avec le module photo. Votre check-in est enregistré en attente.)
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline" className="bg-white/10 border-white/20 text-white">
              Compris
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="py-6 space-y-3 text-center">
            <X className="w-10 h-10 text-red-300 mx-auto" />
            <p className="text-sm text-white/85">{error}</p>
            <Button onClick={() => setStep('idle')} variant="outline" className="bg-white/10 border-white/20 text-white">
              Réessayer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

function messageFor(code: string): string {
  switch (code) {
    case 'consent_missing': return "Activez la géolocalisation dans Réglages → Confidentialité.";
    case 'out_of_geofence': return "Vous n'êtes pas assez près du lieu.";
    case 'cooldown_active': return "Vous avez déjà visité ce lieu récemment.";
    case 'velocity_violation': return "Mouvement trop rapide entre deux check-ins. Patientez quelques minutes.";
    case 'rate_limited': return 'Trop de check-ins. Réessayez plus tard.';
    default: return code;
  }
}
