import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Lock, Star, Crown, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface DefaultAvatar {
  id: string;
  name: string;
  avatar_url: string;
  category: string;
  display_order: number;
  is_exclusive: boolean;
  level_required: number | null;
  required_badge_types: string[] | null;
  rarity: string;
  unlock_description: string | null;
}

interface DefaultAvatarSelectorProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarSelect: (url: string) => void;
}

export const DefaultAvatarSelector = ({ 
  userId, 
  currentAvatarUrl,
  onAvatarSelect 
}: DefaultAvatarSelectorProps) => {
  const [avatars, setAvatars] = useState<DefaultAvatar[]>([]);
  const [unlockedAvatarIds, setUnlockedAvatarIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    fetchDefaultAvatars();
    fetchUnlockedAvatars();
  }, []);

  const fetchDefaultAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from('default_avatars')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setAvatars(data || []);
    } catch (error) {
      logger.error('Error fetching default avatars:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les avatars',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnlockedAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from('user_unlocked_default_avatars')
        .select('avatar_id')
        .eq('user_id', userId);

      if (error) throw error;
      setUnlockedAvatarIds(new Set(data?.map(u => u.avatar_id) || []));
    } catch (error) {
      logger.error('Error fetching unlocked avatars:', error);
    }
  };

  const handleSelectAvatar = async (avatar: DefaultAvatar) => {
    // Check if avatar is locked
    if (avatar.is_exclusive && !unlockedAvatarIds.has(avatar.id)) {
      toast({
        variant: 'destructive',
        title: 'Avatar verrouillé',
        description: avatar.unlock_description || 'Vous devez débloquer cet avatar',
      });
      return;
    }

    try {
      setSelecting(avatar.avatar_url);

      // Update profile with selected default avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatar.avatar_url })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Add cache buster for UI display
      onAvatarSelect(`${avatar.avatar_url}?t=${Date.now()}`);

      toast({
        title: 'Avatar sélectionné',
        description: 'Votre avatar a été mis à jour',
      });
    } catch (error) {
      logger.error('Error selecting avatar:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sélectionner cet avatar',
      });
    } finally {
      setSelecting(null);
    }
  };

  const groupedAvatars = avatars.reduce((acc, avatar) => {
    if (!acc[avatar.category]) {
      acc[avatar.category] = [];
    }
    acc[avatar.category].push(avatar);
    return acc;
  }, {} as Record<string, DefaultAvatar[]>);

  const categoryLabels: Record<string, string> = {
    spiritual: 'Spirituels',
    nature: 'Nature',
    modern: 'Modernes',
    abstract: 'Abstraits',
    general: 'Général',
    legendary: 'Légendaires',
    epic: 'Épiques',
    rare: 'Rares',
    achievement: 'Accomplissements'
  };

  const rarityIcons: Record<string, any> = {
    legendary: Crown,
    epic: Star,
    rare: Sparkles,
    common: null
  };

  const rarityColors: Record<string, string> = {
    legendary: 'border-yellow-500 bg-yellow-500/10',
    epic: 'border-purple-500 bg-purple-500/10',
    rare: 'border-blue-500 bg-blue-500/10',
    common: 'border-border'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue={Object.keys(groupedAvatars)[0]} className="w-full">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(groupedAvatars).length}, 1fr)` }}>
        {Object.keys(groupedAvatars).map(category => (
          <TabsTrigger key={category} value={category}>
            {categoryLabels[category] || category}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(groupedAvatars).map(([category, categoryAvatars]) => (
        <TabsContent key={category} value={category} className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {categoryAvatars.map(avatar => {
              const isSelected = currentAvatarUrl?.includes(avatar.avatar_url);
              const isSelecting = selecting === avatar.avatar_url;
              const isLocked = avatar.is_exclusive && !unlockedAvatarIds.has(avatar.id);
              const RarityIcon = rarityIcons[avatar.rarity];

              return (
                <Card
                  key={avatar.id}
                  className={`relative p-3 cursor-pointer transition-all hover:scale-105 ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : isLocked
                      ? 'opacity-60'
                      : 'hover:bg-accent/50'
                  } ${rarityColors[avatar.rarity] || rarityColors.common}`}
                  onClick={() => !isSelecting && handleSelectAvatar(avatar)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                    <img
                      src={avatar.avatar_url}
                      alt={avatar.name}
                      className={`w-full h-full object-cover ${isLocked ? 'blur-sm grayscale' : ''}`}
                    />
                    
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                        <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-center px-2 text-muted-foreground">
                          {avatar.unlock_description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Rarity badge */}
                  {RarityIcon && (
                    <div className="absolute top-1 left-1">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <RarityIcon className="w-3 h-3" />
                        {avatar.rarity}
                      </Badge>
                    </div>
                  )}
                  
                  {isSelected && !isLocked && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  {isSelecting && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
