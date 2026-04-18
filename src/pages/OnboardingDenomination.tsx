import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Church, BookOpen, Sparkles, MapPin, ArrowLeft } from 'lucide-react';
import ChristianIcon from '@/components/ChristianIcon';
import { useApp, type Denomination } from '@/contexts/AppContext';
import CountrySelect from '@/components/CountrySelect';

interface Choice {
  id: Denomination;
  label: string;
  description: string;
  Icon: typeof Church;
}

const choices: Choice[] = [
  {
    id: 'catholique',
    label: 'Catholique',
    description: '« Tradition, sacrements, pèlerinages et vie paroissiale. »',
    Icon: Church,
  },
  {
    id: 'protestant',
    label: 'Protestant',
    description: '« Bible, foi personnelle, temples et héritage de la Réforme. »',
    Icon: BookOpen,
  },
  {
    id: 'curieux',
    label: 'Curieux du patrimoine chrétien',
    description: '« Architecture, histoire, art et beauté du patrimoine sacré. »',
    Icon: Sparkles,
  },
];

const OnboardingDenomination = () => {
  const navigate = useNavigate();
  const { setDenomination, setCountryOfOrigin } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [pendingDenomination, setPendingDenomination] = useState<Denomination | null>(null);
  const [country, setCountry] = useState<string>('FR');

  const handleSelectDenomination = (id: Denomination) => {
    setPendingDenomination(id);
    setStep(2);
  };

  const handleSkipStep1 = () => {
    setPendingDenomination('curieux');
    setStep(2);
  };

  const handleFinish = async () => {
    await setDenomination(pendingDenomination ?? 'curieux');
    await setCountryOfOrigin(country || 'FR');
    navigate('/home');
  };

  const handleSkipStep2 = async () => {
    await setDenomination(pendingDenomination ?? 'curieux');
    await setCountryOfOrigin('FR');
    navigate('/home');
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-6"
      style={{
        background:
          'linear-gradient(180deg, #0A1628 0%, #0E1B3F 40%, #1a3a52 80%, #0E1B3F 100%)',
      }}
    >
      {/* Glowing icon header */}
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full blur-2xl bg-primary/40 animate-pulse" />
        <div className="relative">
          <ChristianIcon size="lg" />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-white/20'}`} />
        <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-white/20'}`} />
      </div>

      {step === 1 && (
        <>
          <h1 className="font-cinzel text-2xl sm:text-3xl text-center text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Quel est votre profil&nbsp;?
          </h1>
          <p className="text-xs sm:text-sm text-white/70 text-center mb-5 max-w-md">
            Pour personnaliser votre expérience et vos espaces communautaires.
          </p>

          <div className="w-full max-w-md flex flex-col gap-3">
            {choices.map(({ id, label, description, Icon }) => (
              <Card
                key={id}
                onClick={() => handleSelectDenomination(id)}
                className="cursor-pointer group bg-sacred-blue/70 border-primary/30 hover:border-primary hover:bg-sacred-blue/90 transition-all p-4 backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-11 h-11 rounded-full bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-white leading-tight mb-1">
                      {label}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 italic leading-snug">
                      {description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={handleSkipStep1}
            className="mt-4 text-white/60 hover:text-white hover:bg-white/10 text-sm"
          >
            Plus tard
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="font-cinzel text-2xl sm:text-3xl text-center text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            D'où venez-vous&nbsp;?
          </h1>
          <p className="text-xs sm:text-sm text-white/70 text-center mb-5 max-w-md">
            Pour faire briller votre pays dans le classement mondial des pèlerins.
          </p>

          <Card className="w-full max-w-md bg-sacred-blue/70 border-primary/30 p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-white leading-tight mb-1">
                  Pays d'origine
                </h3>
                <p className="text-xs text-white/70 leading-snug">
                  Choisissez le pays auquel vos points seront attribués.
                </p>
              </div>
            </div>

            <CountrySelect
              value={country}
              onChange={setCountry}
              triggerClassName="bg-white/10 border-white/20 text-white hover:bg-white/15"
            />
          </Card>

          <div className="w-full max-w-md flex items-center gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
            <div className="flex-1" />
            <Button
              variant="ghost"
              onClick={handleSkipStep2}
              className="text-white/60 hover:text-white hover:bg-white/10 text-sm"
            >
              Plus tard
            </Button>
            <Button
              onClick={handleFinish}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
            >
              Continuer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default OnboardingDenomination;
