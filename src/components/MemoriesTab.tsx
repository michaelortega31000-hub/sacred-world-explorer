import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Trash2, 
  Lock, 
  Globe, 
  MapPin,
  Calendar,
  Loader2,
  Edit
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getPlaceById } from '@/data/placesData';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Memory {
  id: string;
  place_id: string;
  title: string;
  content: string | null;
  media_urls: string[];
  is_public: boolean;
  created_at: string;
}

const MemoriesTab = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMemories(data || []);
      
      // Generate signed URLs for all photos
      if (data) {
        const urlsMap: Record<string, string[]> = {};
        for (const memory of data) {
          if (memory.media_urls && memory.media_urls.length > 0) {
            const urls = await Promise.all(
              memory.media_urls.map(async (path) => {
                const { data: signedUrlData } = await supabase.storage
                  .from('memory-photos')
                  .createSignedUrl(path, 3600);
                return signedUrlData?.signedUrl || '';
              })
            );
            urlsMap[memory.id] = urls.filter(url => url);
          }
        }
        setPhotoUrls(urlsMap);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos souvenirs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memoryId: string, mediaUrls: string[]) => {
    try {
      setDeletingId(memoryId);

      // Delete photos from storage
      if (mediaUrls.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('memory-photos')
          .remove(mediaUrls);
        
        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      // Delete memory record
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId);

      if (error) throw error;

      setMemories(prev => prev.filter(m => m.id !== memoryId));
      
      toast({
        title: 'Souvenir supprimé',
        description: 'Votre souvenir a été supprimé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le souvenir',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublic = async (memory: Memory) => {
    try {
      const { error } = await supabase
        .from('memories')
        .update({ is_public: !memory.is_public })
        .eq('id', memory.id);

      if (error) throw error;

      setMemories(prev => 
        prev.map(m => 
          m.id === memory.id 
            ? { ...m, is_public: !m.is_public }
            : m
        )
      );

      toast({
        title: 'Visibilité modifiée',
        description: !memory.is_public 
          ? 'Votre souvenir est maintenant public'
          : 'Votre souvenir est maintenant privé',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la visibilité',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-12 text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground mb-2">
            Aucun souvenir enregistré
          </p>
          <p className="text-muted-foreground">
            Visitez des lieux et créez vos premiers souvenirs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 pb-24 sm:pb-8 max-h-[calc(100vh-280px)] overflow-y-auto">
        {memories.map((memory) => {
          const place = getPlaceById(memory.place_id);
          const urls = photoUrls[memory.id] || [];

          return (
            <Card 
              key={memory.id}
              className="overflow-hidden hover:shadow-lg transition-all"
            >
              <CardContent className="p-4">
                {/* Photos Grid */}
                {urls.length > 0 && (
                  <div className={`grid ${urls.length === 1 ? 'grid-cols-1' : urls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 mb-4`}>
                    {urls.slice(0, 3).map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`${memory.title} - Photo ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(url, '_blank')}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        {index === 2 && urls.length > 3 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              +{urls.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Memory Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {memory.title}
                    </h3>
                    {memory.content && (
                      <p className="text-sm text-muted-foreground">
                        {memory.content}
                      </p>
                    )}
                  </div>

                  {/* Place Info */}
                  {place && (
                    <button
                      onClick={() => navigate(`/place/${memory.place_id}`)}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      {place.name}
                    </button>
                  )}

                  {/* Date and visibility */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(memory.created_at), 'PPP', { locale: fr })}
                    </div>
                    
                    <Badge 
                      variant={memory.is_public ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {memory.is_public ? (
                        <>
                          <Globe className="w-3 h-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          Privé
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublic(memory)}
                      className="gap-2 flex-1"
                    >
                      {memory.is_public ? (
                        <>
                          <Lock className="w-3 h-3" />
                          Rendre privé
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3" />
                          Rendre public
                        </>
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                          disabled={deletingId === memory.id}
                        >
                          {deletingId === memory.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce souvenir ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(memory.id, memory.media_urls)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default MemoriesTab;