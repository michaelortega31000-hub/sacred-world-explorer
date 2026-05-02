// "Contribuer une photo" CTA — shown over PlaceSymbol cards when the
// place has no curated/Wikipedia photo yet. User picks a file (or
// captures from camera on mobile), photo is uploaded to Supabase,
// a pending row is created. Other users will see the photo once an
// admin approves it.

import { useRef, useState } from 'react';
import { Camera, Loader2, Check } from 'lucide-react';
import { uploadPlacePhoto } from '@/lib/placePhotos';
import { toast } from 'sonner';

interface Props {
  placeId: string;
  placeName: string;
  onUploaded?: (photoUrl: string) => void;
}

export const ContributePhotoButton = ({ placeId, placeName, onUploaded }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onPick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Photo trop lourde — limite 8 Mo.');
      return;
    }

    setUploading(true);
    try {
      const { storagePath } = await uploadPlacePhoto({ placeId, placeName, file });
      setUploaded(true);
      toast.success('Merci ! Votre photo est en attente de modération.', {
        description: 'Elle apparaîtra ici une fois validée.',
      });
      onUploaded?.(storagePath);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Échec de l\'envoi.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (uploaded) {
    return (
      <div
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5
                   px-3 py-1.5 rounded-full text-[11px] font-semibold
                   bg-emerald-500/15 text-emerald-200 border border-emerald-300/30
                   backdrop-blur-md"
      >
        <Check className="w-3.5 h-3.5" />
        En attente de modération
      </div>
    );
  }

  return (
    <>
      <button
        onClick={onPick}
        disabled={uploading}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5
                   px-3 py-1.5 rounded-full text-[11px] font-semibold
                   bg-amber-300/15 text-amber-200 border border-amber-300/30
                   backdrop-blur-md hover:bg-amber-300/25 active:scale-95
                   transition-all disabled:opacity-60"
        title="Contribuer une photo de ce lieu"
        aria-label="Contribuer une photo"
      >
        {uploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Envoi…
          </>
        ) : (
          <>
            <Camera className="w-3.5 h-3.5" />
            Contribuer une photo
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileSelected}
        className="hidden"
      />
    </>
  );
};
