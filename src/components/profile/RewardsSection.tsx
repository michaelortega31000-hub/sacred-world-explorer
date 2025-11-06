import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Palette, User, Award } from 'lucide-react';
import { RewardCard } from './RewardCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Reward {
  id: string;
  level_required: number;
  reward_type: string;
  reward_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  metadata: any;
}

interface UnlockedReward {
  id: string;
  reward_id: string;
  is_equipped: boolean;
}

interface RewardsSectionProps {
  currentLevel: number;
}

export const RewardsSection = ({ currentLevel }: RewardsSectionProps) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [unlockedRewards, setUnlockedRewards] = useState<UnlockedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
    fetchUnlockedRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('level_rewards')
        .select('*')
        .order('level_required', { ascending: true })
        .order('rarity', { ascending: false });

      if (error) throw error;
      setRewards((data || []) as Reward[]);
    } catch (error) {
      logger.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnlockedRewards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_unlocked_rewards')
        .select('id, reward_id, is_equipped')
        .eq('user_id', user.id);

      if (error) throw error;
      setUnlockedRewards(data || []);
    } catch (error) {
      logger.error('Error fetching unlocked rewards:', error);
    }
  };

  const handleEquipReward = async (rewardId: string, rewardType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const unlockedReward = unlockedRewards.find(ur => ur.reward_id === rewardId);
      if (!unlockedReward) return;

      // Unequip all rewards of the same type first
      const sameTypeRewards = rewards
        .filter(r => r.reward_type === rewardType)
        .map(r => r.id);

      await supabase
        .from('user_unlocked_rewards')
        .update({ is_equipped: false })
        .eq('user_id', user.id)
        .in('reward_id', sameTypeRewards);

      // Equip the selected reward
      const { error } = await supabase
        .from('user_unlocked_rewards')
        .update({ is_equipped: !unlockedReward.is_equipped })
        .eq('id', unlockedReward.id);

      if (error) throw error;

      toast({
        title: unlockedReward.is_equipped ? 'Récompense déséquipée' : 'Récompense équipée',
        description: 'Vos paramètres ont été mis à jour',
      });

      fetchUnlockedRewards();
    } catch (error) {
      logger.error('Error equipping reward:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'équiper cette récompense',
      });
    }
  };

  const isRewardUnlocked = (rewardId: string) => {
    return unlockedRewards.some(ur => ur.reward_id === rewardId);
  };

  const isRewardEquipped = (rewardId: string) => {
    return unlockedRewards.some(ur => ur.reward_id === rewardId && ur.is_equipped);
  };

  const filterRewardsByType = (type: string) => {
    return rewards.filter(r => r.reward_type === type);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des récompenses...</div>;
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold">Récompenses</h2>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="badge">
            <Award className="w-4 h-4 mr-1" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="avatar">
            <User className="w-4 h-4 mr-1" />
            Avatars
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-1" />
            Thèmes
          </TabsTrigger>
          <TabsTrigger value="title">
            <Trophy className="w-4 h-4 mr-1" />
            Titres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {[1, 2, 3, 5, 10].map(level => {
            const levelRewards = rewards.filter(r => r.level_required === level);
            if (levelRewards.length === 0) return null;

            return (
              <div key={level}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Niveau {level}</h3>
                  {level > currentLevel && (
                    <span className="text-xs text-muted-foreground">(Verrouillé)</span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {levelRewards.map(reward => (
                    <RewardCard
                      key={reward.id}
                      icon={reward.icon || '🎁'}
                      name={reward.name}
                      description={reward.description || ''}
                      rarity={reward.rarity}
                      type={reward.reward_type}
                      isUnlocked={isRewardUnlocked(reward.id)}
                      isEquipped={isRewardEquipped(reward.id)}
                      onEquip={() => handleEquipReward(reward.id, reward.reward_type)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {['badge', 'avatar', 'theme', 'title'].map(type => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filterRewardsByType(type).map(reward => (
                <RewardCard
                  key={reward.id}
                  icon={reward.icon || '🎁'}
                  name={reward.name}
                  description={reward.description || ''}
                  rarity={reward.rarity}
                  type={reward.reward_type}
                  isUnlocked={isRewardUnlocked(reward.id)}
                  isEquipped={isRewardEquipped(reward.id)}
                  onEquip={() => handleEquipReward(reward.id, reward.reward_type)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
