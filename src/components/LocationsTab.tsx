import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Image as ImageIcon, Text, Plus, Calendar, Trash2, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getPlaceById } from '@/data/placesData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';

interface Memory {
  id: string;
  place_id: string;
  title: string | null;
  content: string | null;
  media_urls: string[] | null;
  memory_type: string;
  created_at: string;
  is_public: boolean;
}

const LocationsTab = () => {
  const { userProgress } = useApp();
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'photo',
    isPublic: false
  });
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('memory-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('memory-photos')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const addMemory = async () => {
    if (!newMemory.content && !newMemory.title && selectedFiles.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez ajouter un titre, un contenu ou des photos',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploadingPhotos(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedPlace) return;

      let photoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        photoUrls = await uploadPhotos(user.id);
      }

      const { error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          place_id: selectedPlace,
          title: newMemory.title || null,
          content: newMemory.content || null,
          memory_type: selectedFiles.length > 0 ? 'photo' : 'text',
          media_urls: photoUrls.length > 0 ? photoUrls : null,
          is_public: newMemory.isPublic
        });

      if (error) throw error;

      toast({
        title: 'Mémoire ajoutée',
        description: 'Votre souvenir a été enregistré avec succès'
      });

      setNewMemory({ title: '', content: '', type: 'text', isPublic: false });
      setSelectedFiles([]);
      setSelectedPlace(null);
      fetchMemories();
    } catch (error) {
      console.error('Error adding memory:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la mémoire',
        variant: 'destructive'
      });
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId);

      if (error) throw error;

      toast({
        title: 'Mémoire supprimée',
        description: 'Le souvenir a été supprimé'
      });

      fetchMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mémoire',
        variant: 'destructive'
      });
    }
  };

  const visitedPlaces = userProgress.visitedPlaces
    .map(placeId => getPlaceById(placeId))
    .filter(place => place !== null);

  const getPlaceMemories = (placeId: string) => {
    return memories.filter(m => m.place_id === placeId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 
          className="text-4xl font-serif font-bold mb-2"
          style={{ color: '#34E0A1' }}
        >
          Mon Journal de Voyage
        </h1>
        <p className="text-muted-foreground text-lg">
          {visitedPlaces.length} lieu{visitedPlaces.length > 1 ? 'x' : ''} visité{visitedPlaces.length > 1 ? 's' : ''}
        </p>
      </div>

      {visitedPlaces.length === 0 ? (
        <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
          <CardContent className="py-12 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-2">
              Aucun lieu visité pour le moment
            </p>
            <p className="text-muted-foreground">
              Commencez votre voyage spirituel en visitant des lieux sacrés
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-6 pr-4">
            {visitedPlaces.map((place) => {
              if (!place) return null;
              const placeMemories = getPlaceMemories(place.id);

              return (
                <Card 
                  key={place.id}
                  className="overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                    border: '1px solid rgba(52, 224, 161, 0.2)'
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-foreground mb-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          {place.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {place.city}, {place.country}
                        </CardDescription>
                      </div>
                        <Dialog open={selectedPlace === place.id} onOpenChange={(open) => {
                        if (!open) {
                          setSelectedPlace(null);
                          setNewMemory({ title: '', content: '', type: 'text', isPublic: false });
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedPlace(place.id)}
                            className="bg-primary hover:bg-primary/90"
                            style={{
                              boxShadow: '0 0 15px rgba(52, 224, 161, 0.3)'
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un souvenir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-sacred-beige max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-sacred-blue">
                              Nouveau souvenir - {place.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="memory-title" className="text-sacred-blue">Titre</Label>
                              <Input
                                id="memory-title"
                                value={newMemory.title}
                                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                                placeholder="Titre de votre souvenir..."
                                className="mt-2 bg-white/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor="memory-content" className="text-sacred-blue">Contenu</Label>
                              <Textarea
                                id="memory-content"
                                value={newMemory.content}
                                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                                placeholder="Décrivez votre souvenir, vos émotions..."
                                rows={5}
                                className="mt-2 bg-white/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor="memory-photos" className="text-sacred-blue">Photos</Label>
                              <Input
                                id="memory-photos"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="mt-2 bg-white/50"
                              />
                              {selectedFiles.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative group">
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor="memory-public" className="text-sacred-blue">
                                  Partager avec la communauté
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Rendez votre souvenir visible par tous les utilisateurs
                                </p>
                              </div>
                              <Switch
                                id="memory-public"
                                checked={newMemory.isPublic}
                                onCheckedChange={(checked) => setNewMemory({ ...newMemory, isPublic: checked })}
                              />
                            </div>
                            <Button
                              onClick={addMemory}
                              disabled={uploadingPhotos}
                              className="w-full bg-primary hover:bg-primary/90"
                            >
                              {uploadingPhotos ? 'Upload en cours...' : 'Enregistrer'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>

                  {placeMemories.length > 0 && (
                    <CardContent>
                      <div className="space-y-3">
                        {placeMemories.map((memory) => (
                          <div
                            key={memory.id}
                            className="p-4 rounded-lg"
                            style={{
                              background: 'rgba(234, 215, 181, 0.1)',
                              border: '1px solid rgba(52, 224, 161, 0.1)'
                            }}
                          >
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {memory.memory_type === 'photo' ? (
                                  <ImageIcon className="w-4 h-4" />
                                ) : (
                                  <Text className="w-4 h-4" />
                                )}
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(memory.created_at), 'dd MMMM yyyy', { locale: fr })}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMemory(memory.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            {memory.title && (
                              <h4 className="font-semibold text-foreground mb-2">
                                {memory.title}
                              </h4>
                            )}
                            {memory.content && (
                              <p className="text-muted-foreground whitespace-pre-wrap mb-3">
                                {memory.content}
                              </p>
                            )}
                            {memory.media_urls && memory.media_urls.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                {memory.media_urls.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt={`Souvenir ${idx + 1}`}
                                    className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setFullscreenImage(url)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}

                  {placeMemories.length === 0 && (
                    <CardContent>
                      <p className="text-muted-foreground text-sm italic text-center py-2">
                        Aucun souvenir enregistré pour ce lieu
                      </p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
      
      {/* Lightbox pour affichage photo en plein écran */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullscreenImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <img
            src={fullscreenImage}
            alt="Souvenir en plein écran"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default LocationsTab;
