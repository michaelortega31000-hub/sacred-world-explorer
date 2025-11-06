import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  totalPoints: number;
}

export const LevelUpModal = ({ isOpen, onClose, newLevel, totalPoints }: LevelUpModalProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowContent(false);
      
      // Trigger massive confetti burst
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const colors = ['#34E0A1', '#F4C542', '#9B87F5', '#FF6B9D'];

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Left side
        confetti({
          particleCount,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
          gravity: 0.8,
          scalar: 1.2,
        });

        // Right side
        confetti({
          particleCount,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
          gravity: 0.8,
          scalar: 1.2,
        });

        // Center burst
        confetti({
          particleCount: particleCount / 2,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors,
          gravity: 1,
          scalar: 1.5,
        });
      }, 250);

      // Show content after brief delay
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 bg-transparent p-0 shadow-none">
        <div className="relative min-h-[600px] flex items-center justify-center">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-purple-500/20 rounded-3xl backdrop-blur-xl border-2 border-primary/30">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.4), transparent)',
                animation: 'glow-pulse 2s ease-in-out infinite'
              }}
            />
          </div>

          {/* Content */}
          <div 
            className={`relative z-10 text-center px-8 transition-all duration-700 ${
              showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            {/* Animated icons */}
            <div className="relative mb-8">
              <div className="relative inline-block">
                <div 
                  className="absolute inset-0 blur-2xl opacity-50"
                  style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
                >
                  <Trophy className="w-32 h-32 text-accent" />
                </div>
                <Trophy className="relative w-32 h-32 text-accent drop-shadow-2xl" style={{ animation: 'float 3s ease-in-out infinite' }} />
              </div>
              
              {/* Floating stars */}
              <Star className="absolute top-0 left-0 w-8 h-8 text-primary animate-pulse" style={{ animation: 'float 2s ease-in-out infinite' }} />
              <Sparkles className="absolute top-4 right-0 w-10 h-10 text-accent animate-pulse" style={{ animation: 'float 2.5s ease-in-out infinite, spin 4s linear infinite' }} />
              <Zap className="absolute bottom-0 left-4 w-8 h-8 text-purple-400 animate-pulse" style={{ animation: 'float 2.2s ease-in-out infinite' }} />
              <Star className="absolute bottom-4 right-4 w-6 h-6 text-primary animate-pulse" style={{ animation: 'float 2.8s ease-in-out infinite' }} />
            </div>

            {/* Level text */}
            <div className="space-y-4 mb-8">
              <h2 
                className="text-6xl font-black bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent"
                style={{ 
                  animation: 'gradient-shift 3s ease infinite',
                  backgroundSize: '200% auto'
                }}
              >
                NIVEAU {newLevel}
              </h2>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-foreground animate-pulse">
                  🎉 Félicitations ! 🎉
                </p>
                <p className="text-lg text-muted-foreground">
                  Tu as atteint le niveau <span className="text-accent font-bold">{newLevel}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {totalPoints} points au total
                </p>
              </div>
            </div>

            {/* Stats showcase */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm text-muted-foreground">Nouveau</div>
                <div className="text-lg font-bold text-primary">Badge</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-accent/20">
                <div className="text-3xl mb-2">✨</div>
                <div className="text-sm text-muted-foreground">Bonus</div>
                <div className="text-lg font-bold text-accent">+50 XP</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <div className="text-3xl mb-2">🎁</div>
                <div className="text-sm text-muted-foreground">Récompense</div>
                <div className="text-lg font-bold text-purple-400">Débloquée</div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={onClose}
              size="lg"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-purple-500 hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-2xl"
              style={{
                backgroundSize: '200% auto',
                animation: 'gradient-shift 3s ease infinite'
              }}
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Continuer l'aventure
              <Sparkles className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
