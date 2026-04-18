import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Church, BookOpen, Sparkles } from 'lucide-react';
import ChristianIcon from '@/components/ChristianIcon';
import { useApp, type Denomination } from '@/contexts/AppContext';

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
  const { setDenomination } = useApp();

  const handleSelect = async (id: Denomination) => {
    await setDenomination(id);
    navigate('/home');
  };

  const handleSkip = async () => {
    await setDenomination('curieux');
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
            onClick={() => handleSelect(id)}
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
        onClick={handleSkip}
        className="mt-4 text-white/60 hover:text-white hover:bg-white/10 text-sm"
      >
        Plus tard
      </Button>
    </div>
  );
};

export default OnboardingDenomination;
