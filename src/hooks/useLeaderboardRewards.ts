import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export const useLeaderboardRewards = (userId: string | null) => {
  useEffect(() => {
    if (!userId) return;

    // Subscribe to new achievements
    const channel = supabase
      .channel('leaderboard_achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leaderboard_achievements',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const achievement = payload.new;
          
          let title = '🏆 Félicitations !';
          let description = '';

          if (achievement.rank === 1) {
            title = '🥇 Champion Collectionneur !';
            description = 'Vous êtes 1er du classement ! Avatar légendaire débloqué.';
          } else if (achievement.rank === 2) {
            title = '🥈 Vice-Champion !';
            description = 'Vous êtes 2ème du classement ! Avatar légendaire débloqué.';
          } else if (achievement.rank === 3) {
            title = '🥉 Top 3 !';
            description = 'Vous êtes 3ème du classement ! Avatar épique débloqué.';
          }

          toast({
            title,
            description,
            duration: 5000,
          });

          logger.log('Leaderboard achievement unlocked:', achievement);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
};
