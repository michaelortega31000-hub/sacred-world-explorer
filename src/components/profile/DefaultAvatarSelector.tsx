import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface DefaultAvatar {
  id: string;
  name: string;
  avatar_url: string;
  category: string;
  display_order: number;
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
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    fetchDefaultAvatars();
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

  const handleSelectAvatar = async (avatarUrl: string) => {
    try {
      setSelecting(avatarUrl);

      // Update profile with selected default avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Add cache buster for UI display
      onAvatarSelect(`${avatarUrl}?t=${Date.now()}`);

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
    general: 'Général'
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

              return (
                <Card
                  key={avatar.id}
                  className={`relative p-3 cursor-pointer transition-all hover:scale-105 ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => !isSelecting && handleSelectAvatar(avatar.avatar_url)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={avatar.avatar_url}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {isSelected && (
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
