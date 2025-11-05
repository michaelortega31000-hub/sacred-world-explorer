import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette, Building2, Award, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/sacredworld-logo.png';
import { logger } from '@/lib/logger';
import angelIcon from '@/assets/animations/angel.png';
import crescentIcon from '@/assets/animations/crescent.png';
import starDavidIcon from '@/assets/animations/star-david.png';
import omIcon from '@/assets/animations/om.png';
import lotusIcon from '@/assets/animations/lotus.png';
import spiritIcon from '@/assets/animations/spirit.png';
import starsIcon from '@/assets/animations/stars.png';
type Tradition = {
  id: string;
  name: string;
  icon?: React.ElementType;
  image?: string;
  color: string;
};
const traditions: Tradition[] = [{
  id: 'christianity',
  name: 'Christianisme',
  image: angelIcon,
  color: 'hsl(220 70% 50%)'
}, {
  id: 'islam',
  name: 'Islam',
  image: crescentIcon,
  color: 'hsl(142 76% 36%)'
}, {
  id: 'judaism',
  name: 'Judaïsme',
  image: starDavidIcon,
  color: 'hsl(262 83% 58%)'
}, {
  id: 'hinduism',
  name: 'Hindouisme',
  image: omIcon,
  color: 'hsl(24 95% 53%)'
}, {
  id: 'buddhism',
  name: 'Bouddhisme',
  image: lotusIcon,
  color: 'hsl(45 93% 47%)'
}, {
  id: 'other',
  name: 'Autres traditions',
  image: spiritIcon,
  color: 'hsl(173 58% 39%)'
}, {
  id: 'curious',
  name: 'Curieux / Athée',
  image: starsIcon,
  color: 'hsl(215 20% 45%)'
}];
const interests = [{
  id: 'art',
  name: 'Art & Culture',
  icon: Palette
}, {
  id: 'architecture',
  name: 'Architecture',
  icon: Building2
}, {
  id: 'history',
  name: 'Histoire',
  icon: Award
}, {
  id: 'religions',
  name: 'Religions',
  icon: BookOpen
}];
const Traditions = () => {
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();
  const handleMainSelect = (id: string) => {
    setSelectedMain(id);
  };
  const handleInterestToggle = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleContinue = () => {
    // TODO: Sauvegarder les préférences dans le contexte ou Supabase
    logger.log({
      main: selectedMain,
      interests: selectedInterests
    });
    navigate('/explore');
  };
  return <div className="min-h-screen flex flex-col relative p-6 overflow-hidden">
      {/* Cosmic gradient background with slow vertical glow motion */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1B3F] via-[#1a2847] to-[#34E0A1]/20" />
      <div className="absolute inset-0 cosmic-glow pointer-events-none" />
      
      {/* Atmospheric particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#34E0A1] animate-float-particle" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-[#EAD7B5] animate-float-particle" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-[#34E0A1] animate-float-particle" style={{
        animationDelay: '4s'
      }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-[#EAD7B5] animate-float-particle" style={{
        animationDelay: '6s'
      }} />
      </div>
      
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-8 relative z-10">
        {/* Logo au-dessus du titre */}
        <div className="mb-6 flex justify-center animate-fade-in">
          <div className="relative">
            
            {/* Soft glow behind logo */}
            <div className="absolute inset-0 bg-gradient-radial from-[#34E0A1]/20 to-transparent blur-2xl" />
          </div>
        </div>
        
        {/* En-tête */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#F5F5F5] via-[#EAD7B5] to-[#F5F5F5] bg-clip-text text-transparent illuminated-text">
              Quelles traditions t'intéressent ?
            </span>
          </h1>
          <p className="text-lg text-[#EAD7B5]/90 mb-2 font-inter">
            Sélectionnez une religion ou une philosophie
          </p>
        </div>

        {/* Message de respect des lieux de visite */}
        <div className="mb-10 animate-fade-in" style={{
        animationDelay: '50ms'
      }}>
          <div className="max-w-3xl mx-auto px-6 py-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-2 border-[#34E0A1]/30 rounded-2xl shadow-2xl" style={{
          boxShadow: '0 0 30px rgba(52, 224, 161, 0.15), inset 0 0 20px rgba(52, 224, 161, 0.05)'
        }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#34E0A1]/20 flex items-center justify-center">
                <span className="text-2xl">🙏</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#34E0A1] mb-2 font-inter">
                  Respect et Bienveillance
                </h3>
                <p className="text-sm text-[#EAD7B5]/90 font-inter leading-relaxed">
                  En visitant ces lieux sacrés, nous vous invitons à respecter les coutumes locales, les traditions religieuses et les règles de chaque site. Veillez à adopter une tenue appropriée, à suivre les protocoles de visite et à vous comporter avec respect et dignité dans ces espaces de spiritualité et de recueillement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulles principales - Design modernisé */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
            {traditions.map((tradition, index) => {
            const isSelected = selectedMain === tradition.id;
            return <button key={tradition.id} onClick={() => handleMainSelect(tradition.id)} className={cn("flex flex-col items-center gap-4 p-5 rounded-3xl transition-all duration-300 group relative overflow-hidden", "animate-fade-in mystic-card hover:shadow-2xl", isSelected ? "scale-105 shadow-2xl" : "hover:scale-102")} style={{
              animationDelay: `${index * 50}ms`,
              background: isSelected ? `linear-gradient(135deg, ${tradition.color}30, ${tradition.color}20)` : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              border: isSelected ? `3px solid ${tradition.color}` : '2px solid rgba(234, 215, 181, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: isSelected ? `0 8px 32px ${tradition.color}40, 0 0 60px ${tradition.color}20, inset 0 0 40px ${tradition.color}10` : '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="w-full h-full" style={{
                  background: `radial-gradient(circle at 30% 30%, ${tradition.color} 1px, transparent 1px), radial-gradient(circle at 70% 70%, ${tradition.color} 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                  animation: 'float-pattern 20s linear infinite'
                }} />
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 50%, ${tradition.color}20, transparent 70%)`
              }} />
                  
                  <div className={cn("w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative z-10", isSelected && "mystic-pulse animate-pulse")} style={{
                background: isSelected ? `linear-gradient(135deg, ${tradition.color}ee, ${tradition.color}cc)` : `linear-gradient(135deg, ${tradition.color}60, ${tradition.color}40)`,
                boxShadow: isSelected ? `0 0 40px ${tradition.color}90, 0 0 80px ${tradition.color}50, inset 0 0 30px ${tradition.color}40` : `0 0 20px ${tradition.color}50, inset 0 0 15px ${tradition.color}30`
              }}>
                    {/* Inner glow ring */}
                    <div className="absolute inset-2 rounded-full" style={{
                  background: `radial-gradient(circle, transparent 40%, ${tradition.color}30)`
                }} />
                    
                    <img 
                      src={tradition.image} 
                      alt={tradition.name}
                      className="w-14 h-14 transition-all duration-300 group-hover:scale-110 relative z-10 drop-shadow-lg object-contain"
                      style={{
                        filter: isSelected ? 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'brightness(1)'
                      }}
                    />
                  </div>
                  
                  <span className={cn("text-sm font-semibold text-center transition-all duration-300 font-inter relative z-10", isSelected ? "text-[#F5F5F5] scale-105" : "text-[#EAD7B5]/80 group-hover:text-[#EAD7B5]")}>
                    {tradition.name}
                  </span>

                  {/* Selection indicator */}
                  {isSelected && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#34E0A1] flex items-center justify-center animate-scale-in shadow-lg">
                      <svg className="w-4 h-4 text-[#0E1B3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>}
                </button>;
          })}
          </div>
        </div>

        {/* Centres d'intérêt (optionnel) */}
        <div className="mb-10 animate-fade-in" style={{
        animationDelay: '350ms'
      }}>
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4 text-center font-playfair">
            Centres d'intérêt <span className="text-[#EAD7B5]/60 text-sm font-inter">(optionnel)</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {interests.map(interest => {
            const Icon = interest.icon;
            const isChecked = selectedInterests.includes(interest.id);
            return <label key={interest.id} className={cn("flex items-center gap-3 px-6 py-3 rounded-full cursor-pointer transition-all duration-300", "border-2 backdrop-blur-sm", isChecked ? "bg-[#34E0A1]/20 border-[#34E0A1] shadow-lg" : "bg-white/5 border-[#EAD7B5]/20 hover:border-[#34E0A1]/50 hover:bg-white/10")} style={{
              boxShadow: isChecked ? '0 0 20px rgba(52, 224, 161, 0.3)' : 'none'
            }}>
                  <Checkbox checked={isChecked} onCheckedChange={() => handleInterestToggle(interest.id)} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <Icon className={cn("w-5 h-5 transition-colors", isChecked ? "text-[#34E0A1]" : "text-[#EAD7B5]/70")} />
                  <span className={cn("text-sm font-medium transition-colors font-inter", isChecked ? "text-[#F5F5F5]" : "text-[#EAD7B5]/80")}>
                    {interest.name}
                  </span>
                </label>;
          })}
          </div>
        </div>

        {/* Note de respect */}
        <div className="text-center mb-8 animate-fade-in" style={{
        animationDelay: '400ms'
      }}>
          <p className="text-sm text-[#EAD7B5]/70 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg inline-block border border-[#EAD7B5]/20 font-inter">
            ℹ️ Contenus culturels présentés avec neutralité
          </p>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{
        animationDelay: '450ms'
      }}>
          <Button onClick={handleContinue} disabled={!selectedMain} size="lg" className={cn("px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 font-inter", "disabled:opacity-50 disabled:cursor-not-allowed", "bg-gradient-to-r from-[#34E0A1] to-[#2ab385] text-[#0E1B3F]", "hover:from-[#3ffab8] hover:to-[#34E0A1]", selectedMain && "shadow-[0_0_30px_rgba(52,224,161,0.5)] hover:shadow-[0_0_40px_rgba(52,224,161,0.7)] hover:scale-105")}>
            Continuer
          </Button>
          {!selectedMain && <p className="text-sm text-[#EAD7B5]/60 mt-3 font-inter">
              Sélectionne au moins une tradition pour continuer
            </p>}
        </div>
      </div>
    </div>;
};
export default Traditions;