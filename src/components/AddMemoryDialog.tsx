import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Camera, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const memorySchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre est trop long'),
  content: z.string().max(1000, 'Le contenu est trop long').optional(),
});

interface AddMemoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeId: string;
  placeName: string;
  onSuccess?: () => void;
}

export const AddMemoryDialog = ({ 
  open, 
  onOpenChange, 
  placeId, 
  placeName,
  onSuccess 
}: AddMemoryDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Limit to 5 photos
    if (files.length + selectedFiles.length > 5) {
      toast({
        title: 'Limite atteinte',
        description: 'Maximum 5 photos par souvenir',
        variant: 'destructive',
      });
      return;
    }

    // Check file sizes (max 5MB each)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'Chaque photo doit faire moins de 5MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      memorySchema.parse({ title, content });
      
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté',
          variant: 'destructive',
        });
        return;
      }

      // Upload photos using secure server-side validation
      const uploadedPaths: string[] = [];
      const { secureUpload } = await import('@/lib/secureUpload');
      
      for (const file of selectedFiles) {
        // Client-side validation for UX (server will validate too)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: 'Fichier trop volumineux',
            description: `${file.name} dépasse la limite de 10 MB`,
            variant: 'destructive',
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${placeId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const uploadResult = await secureUpload({
          bucket: 'memory-photos',
          filePath: fileName,
          file,
          upsert: false,
        });

        if (!uploadResult.success || uploadResult.error) {
          toast({
            title: 'Erreur d\'upload',
            description: `${file.name}: ${uploadResult.error}`,
            variant: 'destructive',
          });
          continue;
        }

        uploadedPaths.push(uploadResult.path);
      }

      // Check if at least one file was uploaded
      if (uploadedPaths.length === 0) {
        throw new Error('Aucune photo n\'a pu être uploadée');
      }

      // Create memory record with uploaded photo paths
      const { error: insertError } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          place_id: placeId,
          title,
          content: content || null,
          media_urls: uploadedPaths,
          is_public: isPublic,
          memory_type: 'photo'
        });

      if (insertError) throw insertError;

      toast({
        title: 'Souvenir créé !',
        description: isPublic 
          ? 'Votre souvenir est maintenant visible par la communauté'
          : 'Votre souvenir a été enregistré en privé',
      });

      // Reset form
      setTitle('');
      setContent('');
      setIsPublic(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
      onOpenChange(false);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erreur de validation',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le souvenir',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un souvenir</DialogTitle>
          <p className="text-sm text-muted-foreground">{placeName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Magnifique coucher de soleil..."
              disabled={loading}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Description (optionnel)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez votre expérience..."
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos ({selectedFiles.length}/5)</Label>
            
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedFiles.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => document.getElementById('memory-photo-input')?.click()}
                disabled={loading}
              >
                <Camera className="w-4 h-4" />
                {selectedFiles.length === 0 ? 'Ajouter des photos' : 'Ajouter plus de photos'}
              </Button>
            )}
            
            <input
              id="memory-photo-input"
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
              disabled={loading}
            />
            
            <p className="text-xs text-muted-foreground">
              Maximum 5 photos, 5MB chacune
            </p>
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is-public" className="cursor-pointer">
                Rendre public
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPublic 
                  ? 'Visible par tous les utilisateurs'
                  : 'Visible uniquement par vous'}
              </p>
            </div>
            <Switch
              id="is-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={loading || selectedFiles.length === 0}
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                color: 'black'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Créer le souvenir
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};