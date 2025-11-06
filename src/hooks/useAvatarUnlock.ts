import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface UnlockCheckParams {
  userId: string;
  currentLevel: number;
  badges: string[];
}

export const useAvatarUnlock = ({ userId, currentLevel, badges }: UnlockCheckParams) => {
  useEffect(() => {
    if (!userId) return;
    
    checkAndUnlockAvatars();
  }, [userId, currentLevel, badges]);

  const checkAndUnlockAvatars = async () => {
    try {
      // Get all exclusive avatars
      const { data: exclusiveAvatars, error: avatarsError } = await supabase
        .from('default_avatars')
        .select('*')
        .eq('is_exclusive', true)
        .eq('is_active', true);

      if (avatarsError) throw avatarsError;

      // Get already unlocked avatars
      const { data: unlockedAvatars, error: unlockedError } = await supabase
        .from('user_unlocked_default_avatars')
        .select('avatar_id')
        .eq('user_id', userId);

      if (unlockedError) throw unlockedError;

      const unlockedIds = new Set(unlockedAvatars?.map(u => u.avatar_id) || []);

      // Check which avatars can be unlocked
      const toUnlock = [];
      
      for (const avatar of exclusiveAvatars || []) {
        // Skip if already unlocked
        if (unlockedIds.has(avatar.id)) continue;

        let canUnlock = false;

        // Check level requirement
        if (avatar.level_required && currentLevel >= avatar.level_required) {
          canUnlock = true;
        }

        // Check badge requirements
        if (avatar.required_badge_types && avatar.required_badge_types.length > 0) {
          const hasBadgeType = avatar.required_badge_types.some((type: string) =>
            badges.some(badge => badge.includes(type))
          );
          
          if (hasBadgeType) {
            canUnlock = true;
          }
        }

        if (canUnlock) {
          toUnlock.push(avatar);
        }
      }

      // Unlock avatars
      if (toUnlock.length > 0) {
        const unlockPromises = toUnlock.map(avatar =>
          supabase
            .from('user_unlocked_default_avatars')
            .insert({
              user_id: userId,
              avatar_id: avatar.id
            })
        );

        await Promise.all(unlockPromises);

        // Show notification for each unlocked avatar
        toUnlock.forEach(avatar => {
          toast({
            title: '🎉 Nouvel avatar débloqué !',
            description: `Vous avez débloqué "${avatar.name}" (${avatar.rarity})`,
          });
        });
      }
    } catch (error) {
      logger.error('Error checking avatar unlocks:', error);
    }
  };

  return { checkAndUnlockAvatars };
};
