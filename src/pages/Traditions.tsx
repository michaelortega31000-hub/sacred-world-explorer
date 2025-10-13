import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cross, Moon, Star, CircleDot, Flower2, Mountain, Compass, Church, Palette, Award, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/sacredworld-logo.png';

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
  { id: 'art', name: 'Art & Culture', icon: Palette },
  { id: 'architecture', name: 'Architecture', icon: Church },
  { id: 'history', name: 'Histoire', icon: Award },
  { id: 'religions', name: 'Religions', icon: BookOpen },
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
    <div className="min-h-screen flex flex-col relative p-6 overflow-hidden">
      {/* Cosmic gradient background with slow vertical glow motion */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1B3F] via-[#1a2847] to-[#34E0A1]/20" />
      <div className="absolute inset-0 cosmic-glow pointer-events-none" />
      
      {/* Atmospheric particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#34E0A1] animate-float-particle" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-[#EAD7B5] animate-float-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-[#34E0A1] animate-float-particle" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-[#EAD7B5] animate-float-particle" style={{ animationDelay: '6s' }} />
      </div>
      
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-8 relative z-10">
        {/* Logo au-dessus du titre */}
        <div className="mb-6 flex justify-center animate-fade-in">
          <div className="relative">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(52, 224, 161, 0.6)) drop-shadow(0 0 40px rgba(52, 224, 161, 0.3))'
              }}
            />
            {/* Soft glow behind logo */}
            <div className="absolute inset-0 bg-gradient-radial from-[#34E0A1]/20 to-transparent blur-2xl" />
          </div>
        </div>
        
        {/* En-tête */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#F5F5F5] via-[#EAD7B5] to-[#F5F5F5] bg-clip-text text-transparent illuminated-text">
              Quelles traditions t'intéressent ?
            </span>
          </h1>
          <p className="text-lg text-[#EAD7B5]/90 mb-2 font-inter">
            Choisis ta préférence principale
          </p>
          <p className="text-sm text-[#EAD7B5]/60 font-inter">
            Tu pourras changer plus tard.
          </p>
        </div>

        {/* Message de respect des coutumes */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="max-w-2xl mx-auto px-6 py-4 bg-white/5 backdrop-blur-sm border border-[#EAD7B5]/20 rounded-xl">
            <p className="text-sm text-[#EAD7B5]/90 text-center font-inter leading-relaxed">
              🙏 SacredWorld célèbre la diversité culturelle et spirituelle. Nous vous invitons à respecter les coutumes, traditions et lois de chaque lieu et religion que vous découvrez. Voyagez avec ouverture d'esprit et bienveillance.
            </p>
          </div>
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
                    "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 group relative",
                    "animate-fade-in mystic-card",
                    isSelected
                      ? "scale-105"
                      : "hover:scale-102"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    backgroundColor: isSelected ? tradition.color + '25' : 'rgba(255,255,255,0.05)',
                    border: isSelected ? `2px solid ${tradition.color}` : '2px solid rgba(234, 215, 181, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Sacred geometry background */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="w-full h-full sacred-geometry" style={{ 
                      borderRadius: '1rem',
                      background: `radial-gradient(circle at 50% 50%, ${tradition.color} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 luminous-circle",
                      isSelected && "mystic-pulse"
                    )}
                    style={{
                      backgroundColor: tradition.color + (isSelected ? 'dd' : '40'),
                      boxShadow: isSelected 
                        ? `0 0 30px ${tradition.color}80, 0 0 60px ${tradition.color}40, inset 0 0 20px ${tradition.color}30`
                        : `0 0 15px ${tradition.color}40, inset 0 0 10px ${tradition.color}20`,
                    }}
                  >
                    {/* Particle aura */}
                    <div className="absolute inset-0 rounded-full particle-aura" style={{
                      boxShadow: `0 0 40px ${tradition.color}60`
                    }} />
                    
                    <Icon
                      className="w-10 h-10 transition-transform duration-300 group-hover:scale-110 relative z-10"
                      style={{ color: isSelected ? 'white' : tradition.color }}
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className={cn(
                    "text-sm font-medium text-center transition-colors font-inter relative z-10",
                    isSelected ? "text-[#F5F5F5]" : "text-[#EAD7B5]/80"
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
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 text-center font-playfair">
            Centres d'intérêt <span className="text-[#EAD7B5]/60 text-sm font-inter">(optionnel)</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {interests.map((interest) => {
              const Icon = interest.icon;
              const isChecked = selectedInterests.includes(interest.id);
              
              return (
                <label
                  key={interest.id}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer transition-all duration-300",
                    "border-2 backdrop-blur-sm",
                    isChecked
                      ? "bg-[#34E0A1]/20 border-[#34E0A1] shadow-lg"
                      : "bg-white/5 border-[#EAD7B5]/20 hover:border-[#34E0A1]/50 hover:bg-white/10"
                  )}
                  style={{
                    boxShadow: isChecked ? '0 0 20px rgba(52, 224, 161, 0.3)' : 'none'
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleInterestToggle(interest.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isChecked ? "text-[#34E0A1]" : "text-[#EAD7B5]/70"
                  )} />
                  <span className={cn(
                    "text-sm font-medium transition-colors font-inter",
                    isChecked ? "text-[#F5F5F5]" : "text-[#EAD7B5]/80"
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
          <p className="text-sm text-[#EAD7B5]/70 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg inline-block border border-[#EAD7B5]/20 font-inter">
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
              "px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 font-inter",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "bg-gradient-to-r from-[#34E0A1] to-[#2ab385] text-[#0E1B3F]",
              "hover:from-[#3ffab8] hover:to-[#34E0A1]",
              selectedMain && "shadow-[0_0_30px_rgba(52,224,161,0.5)] hover:shadow-[0_0_40px_rgba(52,224,161,0.7)] hover:scale-105"
            )}
          >
            Continuer
          </Button>
          {!selectedMain && (
            <p className="text-sm text-[#EAD7B5]/60 mt-3 font-inter">
              Sélectionne au moins une tradition pour continuer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Traditions;
