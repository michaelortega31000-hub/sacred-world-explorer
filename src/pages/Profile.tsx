import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, MapPin, Star, Globe, Camera, User, BookOpen, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from '@/hooks/useRateLimit';
import { logger } from '@/lib/logger';
import LocationsTab from '@/components/LocationsTab';
import MemoriesTab from '@/components/MemoriesTab';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { userProgress } = useApp();
  const { checkRateLimit } = useRateLimit();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Check if we should open the journal tab
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('section') || 'profile';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
        fetchAvatar(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchAvatar = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching avatar:', error);
        return;
      }
      
      if (data?.avatar_url) {
        logger.log('Avatar URL found:', data.avatar_url);
        setAvatarUrl(data.avatar_url);
      } else {
        logger.log('No avatar URL found for user');
      }
    } catch (error) {
      logger.error('Error fetching avatar:', error);
    }
  };

  const validateFileSignature = async (file: File): Promise<boolean> => {
    try {
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
      
      // Validate file size (2MB limit)
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        toast({
          variant: 'destructive',
          title: 'Fichier trop volumineux',
          description: 'La photo de profil doit faire moins de 2 Mo',
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Type de fichier non autorisé',
          description: 'Veuillez utiliser une image JPG, PNG ou WebP',
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
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      
      toast({
        title: 'Photo de profil mise à jour',
        description: 'Votre photo de profil a été mise à jour avec succès',
      });
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

  const badgeLabels: Record<string, string> = {
    explorer: 'Explorateur',
    pilgrim: 'Pèlerin',
    master: 'Maître'
  };

  return (
    <div className="min-h-screen bg-sacred-blue relative overflow-hidden">
      {/* Background with rotating globe effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="memories" className="gap-2">
              <Image className="w-4 h-4" />
              Souvenirs
            </TabsTrigger>
            <TabsTrigger value="journal" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Journal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div 
              className="bg-sacred-beige/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(52, 224, 161, 0.2), 0 0 80px rgba(244, 197, 66, 0.1)'
              }}
            >

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary/20">
                <AvatarImage src={avatarUrl || undefined} alt="Photo de profil" />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition-colors shadow-lg"
              >
                <Camera className="w-5 h-5 text-primary-foreground" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {uploading && (
              <p className="text-sm text-muted-foreground mt-2">Téléchargement en cours...</p>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Points totaux */}
            <Card className="p-4 sm:p-6 bg-white/50 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points totaux</p>
                  <p className="text-3xl font-bold text-primary">{userProgress.totalPoints}</p>
                </div>
              </div>
            </Card>

            {/* Lieux visités */}
            <Card className="p-4 sm:p-6 bg-white/50 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lieux visités</p>
                  <p className="text-3xl font-bold text-sacred-blue">{userProgress.visitedPlaces.length}</p>
                </div>
              </div>
            </Card>

            {/* Religion sélectionnée */}
            {userProgress.selectedReligion && (
              <Card className="p-4 sm:p-6 bg-white/50 border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tradition spirituelle</p>
                    <p className="text-xl font-semibold text-sacred-blue capitalize">
                      {userProgress.selectedReligion}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Langue */}
            <Card className="p-4 sm:p-6 bg-white/50 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Langue</p>
                  <p className="text-xl font-semibold text-sacred-blue uppercase">
                    {userProgress.language}
                  </p>
                </div>
              </div>
            </Card>

            {/* Badges */}
            {userProgress.badges.length > 0 && (
              <Card className="p-4 sm:p-6 bg-white/50 border-primary/20">
                <h2 className="text-lg font-semibold text-sacred-blue mb-4">Mes Badges</h2>
                <div className="flex flex-wrap gap-2">
                  {userProgress.badges.map((badge) => (
                    <Badge 
                      key={badge}
                      className="bg-primary/20 text-primary px-4 py-2 text-base"
                      style={{
                        boxShadow: '0 0 10px rgba(52, 224, 161, 0.3)'
                      }}
                    >
                      {badgeLabels[badge] || badge}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Voyage planifié */}
            {userProgress.tripPlaces.length > 0 && (
              <Card className="p-4 sm:p-6 bg-white/50 border-primary/20">
                <h2 className="text-lg font-semibold text-sacred-blue mb-2">Voyage en cours</h2>
                <p className="text-muted-foreground">
                  {userProgress.tripPlaces.length} lieu{userProgress.tripPlaces.length > 1 ? 'x' : ''} planifié{userProgress.tripPlaces.length > 1 ? 's' : ''}
                </p>
              </Card>
            )}
          </div>
        </div>
          </TabsContent>

          <TabsContent value="memories">
            <MemoriesTab />
          </TabsContent>

          <TabsContent value="journal">
            <LocationsTab />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
