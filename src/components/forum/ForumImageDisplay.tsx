import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ForumImageDisplayProps {
  imageUrls: string[];
  onImageClick: (urls: string[], index: number) => void;
}

export const ForumImageDisplay = ({ imageUrls, onImageClick }: ForumImageDisplayProps) => {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignedUrls = async () => {
      setLoading(true);
      const urls = await Promise.all(
        imageUrls.map(async (path) => {
          const { data } = await supabase.storage
            .from('forum-photos')
            .createSignedUrl(path, 3600);
          return data?.signedUrl || '';
        })
      );
      setSignedUrls(urls.filter(Boolean));
      setLoading(false);
    };

    if (imageUrls.length > 0) {
      loadSignedUrls();
    } else {
      setLoading(false);
    }
  }, [imageUrls]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Chargement des images...
      </div>
    );
  }

  if (signedUrls.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {signedUrls.map((url, index) => (
        <div
          key={index}
          className="relative group cursor-pointer"
          onClick={() => onImageClick(imageUrls, index)}
        >
          <img
            src={url}
            alt={`Photo ${index + 1}`}
            className="h-20 w-20 object-cover rounded-lg border border-border hover:border-primary transition-colors"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
              Agrandir
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
