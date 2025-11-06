import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Check, Trash2, User, Plus, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { useRateLimit } from '@/hooks/useRateLimit';
import { DefaultAvatarSelector } from './DefaultAvatarSelector';

interface CustomAvatar {
  id: string;
  avatar_url: string;
  name: string | null;
  is_active: boolean;
  uploaded_at: string;
}

interface AvatarGalleryProps {
  userId: string;
  currentAvatarUrl: string | null;
  onAvatarChange: (url: string) => void;
}

export const AvatarGallery = ({ userId, currentAvatarUrl, onAvatarChange }: AvatarGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatars, setAvatars] = useState<CustomAvatar[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { checkRateLimit } = useRateLimit();

  useEffect(() => {
    if (isOpen) {
      fetchAvatars();
    }
  }, [isOpen]);

  const fetchAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from('user_custom_avatars')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setAvatars(data || []);
    } catch (error) {
      logger.error('Error fetching avatars:', error);
    }
  };

  const validateFileSignature = async (file: File): Promise<boolean> => {
    try {
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        return true;
      }

      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      const isValidJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
      const isValidPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
      const isValidWebP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
      
      return isValidJPEG || isValidPNG || isValidWebP;
    } catch {
      return false;
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      // Check rate limit: 10 avatar uploads per day
      const { allowed } = await checkRateLimit(userId, {
        action: 'avatar_gallery_upload',
        limit: 10,
        windowMinutes: 1440
      });

      if (!allowed) {
        toast({
          variant: 'destructive',
          title: 'Limite atteinte',
          description: 'Vous avez atteint la limite de 10 avatars par jour',
        });
        return;
      }

      const file = event.target.files[0];
      
      // Validate file size (2MB limit)
      const MAX_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast({
          variant: 'destructive',
          title: 'Fichier trop volumineux',
          description: 'L\'avatar doit faire moins de 2 Mo',
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!allowedTypes.includes(file.type) && !/\.(heic|heif)$/i.test(file.name)) {
        toast({
          variant: 'destructive',
          title: 'Type de fichier non autorisé',
          description: 'Veuillez utiliser une image JPG, PNG, WebP ou HEIC',
        });
        return;
      }
      
      // Validate file signature
      const isValidFile = await validateFileSignature(file);
      if (!isValidFile) {
        toast({
          variant: 'destructive',
          title: 'Fichier invalide',
          description: "Ce fichier n'est pas une image valide",
        });
        return;
      }

      // Convert HEIC/HEIF to JPEG for browser compatibility
      let processedFile = file;
      let fileExt = file.name.split('.').pop();
      
      if (file.type === 'image/heic' || file.type === 'image/heif' || /\.(heic|heif)$/i.test(file.name)) {
        try {
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({ 
            blob: file, 
            toType: 'image/jpeg', 
            quality: 0.9 
          }) as Blob;
          processedFile = new File([convertedBlob], `custom-${Date.now()}.jpg`, { type: 'image/jpeg' });
          fileExt = 'jpg';
        } catch (conversionError) {
          logger.error('HEIC conversion error:', conversionError);
          toast({
            variant: 'destructive',
            title: 'Erreur de conversion',
            description: 'Impossible de convertir l\'image HEIC. Essayez un format JPG ou PNG.',
          });
          return;
        }
      }

      // Convert image to base64 for moderation
      const reader = new FileReader();
      reader.readAsDataURL(processedFile);
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });

      const imageBase64 = await base64Promise;

      // Call moderation function
      toast({
        title: 'Analyse en cours',
        description: 'Vérification du contenu de l\'image...',
      });

      const { data: moderationData, error: moderationError } = await supabase.functions.invoke(
        'moderate-avatar',
        {
          body: { imageBase64, fileName: processedFile.name }
        }
      );

      if (moderationError) {
        throw new Error(moderationError.message);
      }

      if (!moderationData.approved) {
        toast({
          variant: 'destructive',
          title: 'Image refusée',
          description: moderationData.reason || 'Cette image ne respecte pas nos règles de contenu',
        });
        return;
      }
      
      const fileName = `${userId}/custom-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, processedFile, {
          cacheControl: '0'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Save to database with approved status (clean URL, no cache buster)
      const { error: dbError } = await supabase
        .from('user_custom_avatars')
        .insert({
          user_id: userId,
          avatar_url: publicUrl,
          name: processedFile.name,
          moderation_status: 'approved',
          moderated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast({
        title: 'Avatar ajouté',
        description: 'Votre nouvel avatar a été ajouté à la galerie',
      });

      fetchAvatars();
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader l\'avatar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSetActive = async (avatarId: string) => {
    try {
      const { error } = await supabase.rpc('set_active_avatar', {
        p_avatar_id: avatarId
      });

      if (error) throw error;

      const avatar = avatars.find(a => a.id === avatarId);
      if (avatar) {
        // Remove any existing cache buster and add a fresh one for UI display
        const cleanUrl = avatar.avatar_url.split('?')[0];
        onAvatarChange(`${cleanUrl}?t=${Date.now()}`);
      }

      toast({
        title: 'Avatar activé',
        description: 'Votre avatar a été mis à jour',
      });

      fetchAvatars();
    } catch (error) {
      logger.error('Error setting active avatar:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'activer cet avatar',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (avatarId: string, avatarUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = avatarUrl.split('/avatars/');
      if (urlParts.length < 2) return;
      
      const filePath = urlParts[1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_custom_avatars')
        .delete()
        .eq('id', avatarId);

      if (dbError) throw dbError;

      toast({
        title: 'Avatar supprimé',
        description: 'L\'avatar a été supprimé de votre galerie',
      });

      fetchAvatars();
    } catch (error) {
      logger.error('Error deleting avatar:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer cet avatar',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <User className="w-4 h-4 mr-2" />
        Galerie d'avatars
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Ma galerie d'avatars
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Avatars par défaut
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <Upload className="w-4 h-4" />
                Mes uploads
              </TabsTrigger>
            </TabsList>

            {/* Default Avatars Tab */}
            <TabsContent value="default" className="mt-4">
              <DefaultAvatarSelector 
                userId={userId}
                currentAvatarUrl={currentAvatarUrl || undefined}
                onAvatarSelect={onAvatarChange}
              />
            </TabsContent>

            {/* Custom Avatars Tab */}
            <TabsContent value="custom" className="mt-4">
              {/* Upload Button */}
              <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="p-4 bg-primary/10 rounded-full">
                    {uploading ? (
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">
                      {uploading ? 'Upload en cours...' : 'Ajouter un nouvel avatar'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP ou HEIC - Max 2 Mo
                    </p>
                  </div>
                </label>
              </Card>

              {/* Avatars Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {avatars.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className={`relative p-3 cursor-pointer transition-all hover:scale-105 ${
                      avatar.is_active ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    onClick={() => handleSetActive(avatar.id)}
                  >
                    {avatar.is_active && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="bg-primary rounded-full p-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}

                    <Avatar className="w-full h-auto aspect-square">
                      <AvatarImage src={avatar.avatar_url} alt={avatar.name || 'Avatar'} />
                      <AvatarFallback>
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 h-6 w-6 bg-destructive/90 hover:bg-destructive text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(avatar.id, avatar.avatar_url);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </Card>
                ))}
              </div>

              {avatars.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Aucun avatar personnalisé</p>
                  <p className="text-sm">Uploadez votre premier avatar ci-dessus</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
