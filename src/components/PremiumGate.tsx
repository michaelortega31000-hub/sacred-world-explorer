import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface Props {
  children: ReactNode;
  // Stripe price ID for the upsell shown when blocked. Replace with your real price.
  priceId?: string;
  fallbackTitle?: string;
  fallbackBody?: string;
}

// Wrap any premium-only feature with <PremiumGate>. While loading, renders
// nothing. If user has an active premium sub, renders children. Otherwise an
// upsell card with a checkout CTA.
export const PremiumGate = ({
  children,
  priceId,
  fallbackTitle = 'Réservé aux membres Premium',
  fallbackBody = 'Soutenez SacredWorld et débloquez les contenus avancés, l\'assistant illimité, les voix audio et les cosmétiques exclusifs.',
}: Props) => {
  const { loading, isPremium, startCheckout } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isPremium) return <>{children}</>;

  return (
    <Card className="p-6 text-center space-y-3 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
      <Sparkles className="w-8 h-8 text-primary mx-auto" />
      <h3 className="font-cinzel text-lg">{fallbackTitle}</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">{fallbackBody}</p>
      <Button
        onClick={() => priceId && startCheckout(priceId).catch(console.error)}
        disabled={!priceId}
        className="bg-primary hover:bg-primary/90"
      >
        {priceId ? 'Devenir Premium' : 'Bientôt disponible'}
      </Button>
    </Card>
  );
};
