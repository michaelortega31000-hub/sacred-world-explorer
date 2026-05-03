import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionState {
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | null;
  endsAt: string | null;
  loading: boolean;
}

export function useSubscription(): SubscriptionState & {
  isPremium: boolean;
  startCheckout: (priceId: string) => Promise<void>;
} {
  const { session } = useApp();
  const [state, setState] = useState<SubscriptionState>({
    tier: 'free',
    status: null,
    endsAt: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!session?.user) {
        if (!cancelled) setState({ tier: 'free', status: null, endsAt: null, loading: false });
        return;
      }
      const { data } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, status, subscription_end')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (cancelled) return;
      const row = data as any;
      const active = row?.status === 'active' && (row?.subscription_tier ?? 'free') === 'premium';
      setState({
        tier: active ? 'premium' : 'free',
        status: (row?.status as SubscriptionState['status']) ?? null,
        endsAt: (row?.subscription_end as string | null) ?? null,
        loading: false,
      });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const startCheckout = async (priceId: string) => {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { price_id: priceId },
    });
    if (error || !data?.url) {
      throw error ?? new Error('Stripe checkout unavailable');
    }
    window.location.href = data.url;
  };

  return { ...state, isPremium: state.tier === 'premium', startCheckout };
}
