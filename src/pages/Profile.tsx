import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, MapPin, Star, Globe, Camera, User, BookOpen, TrendingUp, Share2, Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useAvatarUnlock } from '@/hooks/useAvatarUnlock';
import { logger } from '@/lib/logger';
import { ImageBackground } from '@/components/ImageBackground';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { mockPlaces } from '@/data/placesData';
import { getImageUrl } from '@/lib/imageHelper';
import { StatsCard } from '@/components/profile/StatsCard';
import { StatsChart } from '@/components/profile/StatsChart';
import { BentoGallery } from '@/components/profile/BentoGallery';
import { Badge3DCard } from '@/components/profile/Badge3DCard';
import { ProgressSection } from '@/components/profile/ProgressSection';
import { LevelUpModal } from '@/components/profile/LevelUpModal';
import { RewardsSection } from '@/components/profile/RewardsSection';
import { AvatarGallery } from '@/components/profile/AvatarGallery';
import { SocialShareButtons } from '@/components/profile/SocialShareButtons';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProgress } = useApp();
  const { checkRateLimit } = useRateLimit();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [questBadges, setQuestBadges] = useState<Array<{
    id: string;
    place_id: string;
    quest_name: string;
    quest_description: string;
    quest_icon: string;
    unlocked_at: string;
  }>>([]);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 1, points: 0 });
  const [hasShownLevelUp, setHasShownLevelUp] = useState<Set<number>>(new Set());
  const [isPublic, setIsPublic] = useState(false);
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);

  const currentLevel = useMemo(() => Math.floor(userProgress.totalPoints / 100) + 1, [userProgress.totalPoints]);

  // Auto-unlock avatars based on level and badges
  useAvatarUnlock({
    userId: userId || '',
    currentLevel,
    badges: userProgress.badges
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
        fetchAvatar(session.user.id);
        fetchQuestBadges(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  // Check for level up
  useEffect(() => {
    const storedLevel = localStorage.getItem('lastKnownLevel');
    const lastLevel = storedLevel ? parseInt(storedLevel) : 1;

    if (currentLevel > lastLevel && !hasShownLevelUp.has(currentLevel)) {
      // Level up detected!
      setLevelUpData({ level: currentLevel, points: userProgress.totalPoints });
      setShowLevelUpModal(true);
    } else if (!storedLevel) {
      // First visit, store current level
      localStorage.setItem('lastKnownLevel', currentLevel.toString());
    }
  }, [currentLevel, userProgress.totalPoints, hasShownLevelUp]);

  const fetchQuestBadges = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('id, place_id, quest_name, quest_description, quest_icon, unlocked_at')
        .eq('user_id', uid)
        .eq('badge_type', 'quest')
        .order('unlocked_at', { ascending: false });

      if (error) {
        logger.error('Error fetching quest badges:', error);
        return;
      }
      
      if (data) {
        setQuestBadges(data);
      }
    } catch (error) {
      logger.error('Error fetching quest badges:', error);
    }
  };

  const fetchAvatar = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, is_public, username')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching avatar:', error);
        return;
      }
      
      if (data) {
        logger.log('Profile data found:', data);
        setAvatarUrl(data.avatar_url || null);
        setIsPublic(data.is_public || false);
        setUsername(data.username || '');
      } else {
        logger.log('No profile data found for user');
      }
    } catch (error) {
      logger.error('Error fetching profile:', error);
    }
  };

  const validateFileSignature = async (file: File): Promise<boolean> => {
    try {
      // Skip validation for HEIC/HEIF files as they're valid iOS formats
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        return true;
      }

      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      // Check magic numbers for allowed image types
      const isValidJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
      const isValidPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
      const isValidWebP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
      
      return isValidJPEG || isValidPNG || isValidWebP;
    } catch {
      return false;
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      // Check rate limit: 5 avatar uploads per day
      if (userId) {
        const { allowed } = await checkRateLimit(userId, {
          action: 'avatar_upload',
          limit: 5,
          windowMinutes: 1440 // 24 hours
        });

        if (!allowed) {
          toast({
            variant: 'destructive',
            title: 'Limite atteinte',
            description: 'Vous avez atteint la limite de 5 changements de photo par jour',
          });
          return;
        }
      }

      const file = event.target.files[0];
      
      // Client-side validation (UX only - server will validate too)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        toast({
          variant: 'destructive',
          title: 'Fichier trop volumineux',
          description: 'La photo de profil doit faire moins de 5 Mo',
        });
        return;
      }
      
      // Validate file type (including HEIC/HEIF for iOS devices)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Type de fichier non autorisé',
          description: 'Veuillez utiliser une image JPG, PNG, WebP ou HEIC',
        });
        return;
      }
      
      // Validate file signature (magic numbers)
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
          processedFile = new File([convertedBlob], 'avatar.jpg', { type: 'image/jpeg' });
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
      
      const filePath = `${userId}/avatar.${fileExt}`;

      // Use secure server-side upload with validation
      const { secureUpload } = await import('@/lib/secureUpload');
      const uploadResult = await secureUpload({
        bucket: 'avatars',
        filePath,
        file: processedFile,
        upsert: true,
      });

      if (!uploadResult.success || uploadResult.error) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Use the URL from upload result (already contains public URL)
      const publicUrl = uploadResult.url;

      // Update profile with clean URL (no cache buster in DB)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Add cache buster only for UI display
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      
      toast({
        title: 'Photo de profil mise à jour',
        description: 'Votre photo de profil a été mise à jour avec succès',
      });

      // Refresh avatar to ensure UI is up to date
      if (userId) {
        await fetchAvatar(userId);
      }
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la photo de profil',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePublicToggle = async (checked: boolean) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_public: checked })
        .eq('id', userId);

      if (error) throw error;

      setIsPublic(checked);
      toast({
        title: checked ? 'Profil public' : 'Profil privé',
        description: checked 
          ? 'Votre profil est maintenant visible publiquement'
          : 'Votre profil est maintenant privé',
      });
    } catch (error) {
      logger.error('Error updating profile visibility:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier la visibilité du profil',
      });
    }
  };

  const handleCopyShareLink = () => {
    if (!username) {
      toast({
        variant: 'destructive',
        title: 'Nom d\'utilisateur requis',
        description: 'Veuillez définir un nom d\'utilisateur dans les paramètres',
      });
      return;
    }

    const shareUrl = `${window.location.origin}/u/${username}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: 'Lien copié !',
      description: 'Le lien de partage a été copié dans le presse-papiers',
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const badgeLabels: Record<string, string> = {
    explorer: 'Explorateur',
    pilgrim: 'Pèlerin',
    master: 'Maître'
  };

  // Generate mock chart data (last 7 days)
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        points: Math.max(0, userProgress.totalPoints - (i * 20) + Math.random() * 10)
      });
    }
    return data;
  }, [userProgress.totalPoints]);

  const visitedPlacesWithImages = useMemo(() => {
    return userProgress.visitedPlaces
      .map(placeId => mockPlaces.find(p => p.id === placeId))
      .filter(place => place)
      .map(place => ({
        id: place!.id,
        name: place!.name,
        imageUrl: getImageUrl(place!.imageUrl || '')
      }));
  }, [userProgress.visitedPlaces]);

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with rotating globe effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        </div>

        <BackButton to="/settings" />

        <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24">
          {/* Modern Header with Avatar */}
          <div className="relative mb-8">
            <div 
              className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl p-8 mb-6"
              style={{
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 8s ease infinite'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="relative group mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
                  />
                  <Avatar className="relative w-32 h-32 border-4 border-primary shadow-2xl">
                    <AvatarImage 
                      src={avatarUrl || undefined} 
                      alt="Photo de profil"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (img.src && !img.src.includes('retry=1')) {
                          // Try once more with a new cache buster
                          const baseUrl = img.src.split('?')[0];
                          img.src = `${baseUrl}?t=${Date.now()}&retry=1`;
                        } else {
                          // Failed after retry, show toast
                          toast({
                            variant: 'destructive',
                            title: 'Image non supportée',
                            description: 'Essayez de télécharger une photo au format JPG ou PNG.',
                          });
                        }
                      }}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition-all shadow-lg hover:scale-110"
                  >
                    <Camera className="w-5 h-5 text-primary-foreground" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
                {userProgress.selectedReligion && (
                  <p className="text-muted-foreground capitalize">{userProgress.selectedReligion}</p>
                )}
                {uploading && (
                  <p className="text-sm text-muted-foreground mt-2">Téléchargement en cours...</p>
                )}
                
                {/* Avatar Gallery Button */}
                {userId && (
                  <div className="mt-4">
                    <AvatarGallery 
                      userId={userId} 
                      currentAvatarUrl={avatarUrl}
                      onAvatarChange={(url) => setAvatarUrl(url)}
                    />
                  </div>
                )}

                {/* Public Profile Sharing */}
                <Card className="mt-6 p-4 bg-card/60 backdrop-blur-sm border-primary/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public-profile" className="text-base font-semibold">
                          Profil public
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Permettre aux autres de voir vos statistiques
                        </p>
                      </div>
                      <Switch
                        id="public-profile"
                        checked={isPublic}
                        onCheckedChange={handlePublicToggle}
                      />
                    </div>

                    {isPublic && username && (
                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <Button
                          onClick={handleCopyShareLink}
                          variant="outline"
                          className="w-full"
                          size="sm"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Lien copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copier le lien
                            </>
                          )}
                        </Button>

                        <SocialShareButtons
                          username={username}
                          profileUrl={`${window.location.origin}/u/${username}`}
                          shareText={`Découvrez mon profil SacredWorld @${username} !`}
                        />
                      </div>
                    )}

                    {isPublic && !username && (
                      <p className="text-sm text-muted-foreground pt-2 border-t border-border/50">
                        Définissez un nom d'utilisateur dans les paramètres pour partager votre profil
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Progress Section */}
            <ProgressSection totalPoints={userProgress.totalPoints} />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Points totaux"
                value={userProgress.totalPoints}
                maxValue={Math.max(userProgress.totalPoints + 100, 1000)}
                icon={Trophy}
                description={`Niveau ${Math.floor(userProgress.totalPoints / 100) + 1}`}
              />
              <StatsCard
                title="Lieux visités"
                value={userProgress.visitedPlaces.length}
                maxValue={Math.max(userProgress.visitedPlaces.length + 10, 50)}
                icon={MapPin}
              />
              <StatsCard
                title="Badges"
                value={userProgress.badges.length + questBadges.length}
                maxValue={Math.max((userProgress.badges.length + questBadges.length) + 5, 20)}
                icon={Star}
              />
            </div>

            {/* Stats Chart */}
            {chartData.length > 0 && (
              <StatsChart
                data={chartData}
                title="Évolution de vos points (7 derniers jours)"
              />
            )}

            {/* Bento Gallery */}
            {visitedPlacesWithImages.length > 0 && (
              <BentoGallery places={visitedPlacesWithImages} maxDisplay={9} />
            )}

            {/* Rewards Section */}
            <RewardsSection currentLevel={currentLevel} />

            {/* 3D Badge Cards */}
            {questBadges.length > 0 && (
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Badges de Quêtes Mensuelles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {questBadges.map((badge, index) => {
                    const unlockedDate = new Date(badge.unlocked_at);
                    const isNew = (Date.now() - unlockedDate.getTime()) < 24 * 60 * 60 * 1000; // Last 24h
                    
                    return (
                      <Badge3DCard
                        key={badge.id}
                        icon={badge.quest_icon}
                        name={badge.quest_name}
                        description={badge.quest_description}
                        unlockedAt={badge.unlocked_at}
                        rarity={index === 0 ? 'legendary' : index < 3 ? 'epic' : 'rare'}
                        isNew={isNew}
                      />
                    );
                  })}
                </div>
              </Card>
            )}

            {/* General Badges */}
            {userProgress.badges.length > 0 && (
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Mes Badges
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProgress.badges.map((badge, index) => (
                    <Badge3DCard
                      key={badge}
                      icon={badge === 'master' ? '👑' : badge === 'pilgrim' ? '🎖️' : '🏆'}
                      name={badgeLabels[badge] || badge}
                      description={`Badge ${badgeLabels[badge] || badge}`}
                      unlockedAt={new Date().toISOString()}
                      rarity={badge === 'master' ? 'legendary' : badge === 'pilgrim' ? 'epic' : 'common'}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Voyage planifié */}
            {userProgress.tripPlaces.length > 0 && (
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Voyage en cours
                </h2>
                <p className="text-muted-foreground">
                  {userProgress.tripPlaces.length} lieu{userProgress.tripPlaces.length > 1 ? 'x' : ''} planifié{userProgress.tripPlaces.length > 1 ? 's' : ''}
                </p>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/avatars')}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <User className="w-5 h-5 mr-2" />
                Galerie d'Avatars
              </Button>
              
              <Button
                onClick={() => navigate('/badges')}
                className="w-full h-14 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Voir mes badges
              </Button>
            </div>
          </div>
        </main>

        <BottomNavigation />
      </div>

      {/* Level Up Modal */}
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => {
            setShowLevelUpModal(false);
            setHasShownLevelUp(prev => new Set(prev).add(currentLevel));
            localStorage.setItem('lastKnownLevel', currentLevel.toString());
          }}
          newLevel={levelUpData.level}
          totalPoints={levelUpData.points}
        />
    </ImageBackground>
  );
};

export default Profile;
