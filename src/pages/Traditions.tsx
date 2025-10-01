import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cross, Moon, Star, CircleDot, Flower2, Mountain, Compass, Church, Palette, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tradition = {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
};

const traditions: Tradition[] = [
  { id: 'christianity', name: 'Christianisme', icon: Cross, color: 'hsl(220 70% 50%)' },
  { id: 'islam', name: 'Islam', icon: Moon, color: 'hsl(142 76% 36%)' },
  { id: 'judaism', name: 'Judaïsme', icon: Star, color: 'hsl(262 83% 58%)' },
  { id: 'hinduism', name: 'Hindouisme', icon: CircleDot, color: 'hsl(24 95% 53%)' },
  { id: 'buddhism', name: 'Bouddhisme', icon: Flower2, color: 'hsl(45 93% 47%)' },
  { id: 'other', name: 'Autres traditions', icon: Mountain, color: 'hsl(173 58% 39%)' },
  { id: 'curious', name: 'Curieux / Athée', icon: Compass, color: 'hsl(215 20% 45%)' },
];

const interests = [
  { id: 'architecture', name: 'Architecture', icon: Church },
  { id: 'history', name: 'Histoire', icon: Award },
  { id: 'art', name: 'Art & Culture', icon: Palette },
];

const Traditions = () => {
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleMainSelect = (id: string) => {
    setSelectedMain(id);
  };

  const handleInterestToggle = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // TODO: Sauvegarder les préférences dans le contexte ou Supabase
    console.log({ main: selectedMain, interests: selectedInterests });
    navigate('/world');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-8">
        {/* En-tête */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Quelles traditions t'intéressent ?
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Choisis ta préférence principale
          </p>
          <p className="text-sm text-muted-foreground/80">
            Tu pourras changer plus tard.
          </p>
        </div>

        {/* Bulles principales */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
            {traditions.map((tradition, index) => {
              const Icon = tradition.icon;
              const isSelected = selectedMain === tradition.id;
              
              return (
                <button
                  key={tradition.id}
                  onClick={() => handleMainSelect(tradition.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 group",
                    "animate-fade-in",
                    isSelected
                      ? "scale-105 shadow-lg"
                      : "hover:scale-102 hover:shadow-md"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    backgroundColor: isSelected ? tradition.color + '15' : 'transparent',
                    border: isSelected ? `2px solid ${tradition.color}` : '2px solid hsl(var(--border))',
                  }}
                >
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200",
                      isSelected ? "shadow-lg" : "group-hover:shadow-md"
                    )}
                    style={{
                      backgroundColor: tradition.color + (isSelected ? '' : '20'),
                    }}
                  >
                    <Icon
                      className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
                      style={{ color: isSelected ? 'white' : tradition.color }}
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className={cn(
                    "text-sm font-medium text-center transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {tradition.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Centres d'intérêt (optionnel) */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: '350ms' }}>
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
            Centres d'intérêt <span className="text-muted-foreground text-sm">(optionnel)</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {interests.map((interest) => {
              const Icon = interest.icon;
              const isChecked = selectedInterests.includes(interest.id);
              
              return (
                <label
                  key={interest.id}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer transition-all duration-200",
                    "border-2",
                    isChecked
                      ? "bg-primary/10 border-primary shadow-md"
                      : "bg-background border-border hover:border-primary/50 hover:shadow-sm"
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleInterestToggle(interest.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isChecked ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    isChecked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {interest.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Note de respect */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-sm text-muted-foreground bg-muted/30 px-4 py-3 rounded-lg inline-block">
            ℹ️ Contenus culturels présentés avec neutralité
          </p>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '450ms' }}>
          <Button
            onClick={handleContinue}
            disabled={!selectedMain}
            size="lg"
            className={cn(
              "px-8 py-6 text-lg font-semibold rounded-full transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              selectedMain && "shadow-lg hover:shadow-xl hover:scale-105"
            )}
          >
            Continuer
          </Button>
          {!selectedMain && (
            <p className="text-sm text-muted-foreground mt-3">
              Sélectionne au moins une tradition pour continuer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Traditions;
