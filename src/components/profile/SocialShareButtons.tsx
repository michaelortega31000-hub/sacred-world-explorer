import { Button } from '@/components/ui/button';
import { Facebook, Twitter, MessageCircle, Instagram, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareButtonsProps {
  username: string;
  profileUrl: string;
  shareText?: string;
}

export const SocialShareButtons = ({ 
  username, 
  profileUrl,
  shareText = "Découvrez mon profil SacredWorld !" 
}: SocialShareButtonsProps) => {
  const { toast } = useToast();

  const handleShare = (platform: string, url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    toast({
      title: `Partage sur ${platform}`,
      description: 'Une nouvelle fenêtre s\'est ouverte pour partager votre profil',
    });
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`,
    instagram: profileUrl, // Instagram doesn't support direct sharing via URL, just copy link
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'Lien copié !',
      description: 'Collez ce lien dans votre story ou bio Instagram',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Partager sur :</p>
      <div className="grid grid-cols-2 gap-2">
        {/* Twitter/X */}
        <Button
          onClick={() => handleShare('Twitter', shareUrls.twitter)}
          variant="outline"
          size="sm"
          className="w-full bg-card/50 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2] transition-colors"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>

        {/* Facebook */}
        <Button
          onClick={() => handleShare('Facebook', shareUrls.facebook)}
          variant="outline"
          size="sm"
          className="w-full bg-card/50 hover:bg-[#1877F2]/10 hover:border-[#1877F2] transition-colors"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>

        {/* WhatsApp */}
        <Button
          onClick={() => handleShare('WhatsApp', shareUrls.whatsapp)}
          variant="outline"
          size="sm"
          className="w-full bg-card/50 hover:bg-[#25D366]/10 hover:border-[#25D366] transition-colors"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>

        {/* Instagram */}
        <Button
          onClick={handleInstagramShare}
          variant="outline"
          size="sm"
          className="w-full bg-card/50 hover:bg-[#E4405F]/10 hover:border-[#E4405F] transition-colors"
        >
          <Instagram className="w-4 h-4 mr-2" />
          Instagram
        </Button>
      </div>

      {/* Native Share API (for mobile) */}
      {navigator.share && (
        <Button
          onClick={async () => {
            try {
              await navigator.share({
                title: 'Mon profil SacredWorld',
                text: shareText,
                url: profileUrl,
              });
              toast({
                title: 'Profil partagé',
                description: 'Votre profil a été partagé avec succès',
              });
            } catch (error) {
              // User cancelled or error occurred
              if ((error as Error).name !== 'AbortError') {
                toast({
                  variant: 'destructive',
                  title: 'Erreur',
                  description: 'Impossible de partager le profil',
                });
              }
            }
          }}
          variant="default"
          size="sm"
          className="w-full"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Partager...
        </Button>
      )}
    </div>
  );
};
