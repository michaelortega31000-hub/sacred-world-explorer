import { supabase } from '@/integrations/supabase/client';

interface RateLimitConfig {
  action: string;
  limit: number;
  windowMinutes: number;
}

export const useRateLimit = () => {
  const checkRateLimit = async (
    userId: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number }> => {
    const { action, limit, windowMinutes } = config;
    const windowStart = new Date(Date.now() - windowMinutes * 60000);

    try {
      // Get current rate limit record
      const { data: rateLimitData, error: fetchError } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('action', action)
        .gte('window_start', windowStart.toISOString())
        .maybeSingle();

      if (fetchError) {
        console.error('Rate limit check error:', fetchError);
        return { allowed: true, remaining: limit }; // Fail open to not block users
      }

      const currentCount = rateLimitData?.count || 0;

      if (currentCount >= limit) {
        return { allowed: false, remaining: 0 };
      }

      // Update rate limit
      const newCount = currentCount + 1;
      const { error: upsertError } = await supabase
        .from('rate_limits')
        .upsert({
          user_id: userId,
          action,
          count: newCount,
          window_start: rateLimitData?.window_start || new Date().toISOString(),
        }, {
          onConflict: 'user_id,action'
        });

      if (upsertError) {
        console.error('Rate limit update error:', upsertError);
      }

      return { allowed: true, remaining: limit - newCount };
    } catch (error) {
      console.error('Rate limit error:', error);
      return { allowed: true, remaining: limit }; // Fail open
    }
  };

  return { checkRateLimit };
};
