// Global feed of approved community-contributed sacred places.
// Shows newest first; lets any logged-in user open the submission dialog.

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Loader2, Church } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchCommunityPhotos, fetchUserReactions } from '@/lib/placePhotos';
import CommunityPhotoCard from './CommunityPhotoCard';
import AddSacredPlaceDialog from './AddSacredPlaceDialog';

interface Props {
  country?: string;
}

export const CommunityPlacesFeed = ({ country }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: photos = [], isLoading, refetch } = useQuery({
    queryKey: ['community-photos', country ?? 'all'],
    queryFn: () => fetchCommunityPhotos({ country, limit: 60 }),
    staleTime: 60 * 1000,
  });

  const { data: myReactions } = useQuery({
    queryKey: ['community-photos-mine', photos.map((p) => p.id).join(',')],
    queryFn: () => fetchUserReactions(photos.map((p) => p.id)),
    enabled: photos.length > 0,
    staleTime: 60 * 1000,
  });

  return (
    <div className="relative pb-24">
      <div className="px-4 py-3 flex items-center justify-between border-b border-border bg-card/40">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Church className="w-4 h-4 text-primary" />
            Communauté Sacrée
          </h2>
          <p className="text-xs text-muted-foreground">
            {country
              ? `Lieux partagés en ${country}`
              : 'Lieux sacrés partagés par des pèlerins du monde entier'}
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement…
        </div>
      ) : photos.length === 0 ? (
        <EmptyState onAdd={() => setDialogOpen(true)} country={country} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {photos.map((p) => (
            <CommunityPhotoCard
              key={p.id}
              photo={p}
              myReactions={myReactions?.get(p.id) ?? new Set()}
            />
          ))}
        </div>
      )}

      <AddSacredPlaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultCountry={country}
        onSubmitted={() => refetch()}
      />
    </div>
  );
};

const EmptyState = ({ onAdd, country }: { onAdd: () => void; country?: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <Church className="w-7 h-7 text-primary" />
    </div>
    <h3 className="font-semibold text-foreground">
      {country ? `Aucun lieu partagé en ${country} pour le moment` : 'Soyez le premier à partager'}
    </h3>
    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
      Une petite église de village, une mosquée de quartier, un temple oublié — chaque lieu sacré mérite d'être vu.
    </p>
    <Button onClick={onAdd} className="mt-5">
      <Plus className="w-4 h-4 mr-1" /> Partager un lieu
    </Button>
  </div>
);

export default CommunityPlacesFeed;
