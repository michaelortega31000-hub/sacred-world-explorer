import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Church, BookHeart, Sparkles, Compass, Footprints } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import HeroCarousel from '@/components/home/HeroCarousel';
import ChristianIcon from '@/components/ChristianIcon';

const featured = [
  {
    title: 'À découvrir cette semaine',
    subtitle: 'Une sélection de lieux sacrés à explorer',
    icon: Sparkles,
    cta: 'Voir la carte',
    path: '/explore',
  },
  {
    title: 'Cathédrales emblématiques',
    subtitle: 'Notre-Dame, Chartres, Reims, Amiens…',
    icon: Church,
    cta: 'Parcourir les lieux',
    path: '/places',
  },
  {
    title: 'Sur les chemins de pèlerinage',
    subtitle: 'Saint-Jacques, Lourdes, Mont-Saint-Michel',
    icon: Footprints,
    cta: 'Ouvrir la carte',
    path: '/explore',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header brand strip */}
      <header className="px-4 pt-6 pb-4 flex items-center gap-3">
        <ChristianIcon size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">SacredWorld</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Pour les chrétiens et les curieux de patrimoine
          </p>
        </div>
      </header>

      <main className="px-4 space-y-6 max-w-3xl mx-auto">
        {/* Hero carousel */}
        <HeroCarousel />

        {/* Tagline */}
        <section className="text-center space-y-2 px-2">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Découvrez, vivez et collectionnez le patrimoine sacré chrétien
          </h2>
          <p className="text-sm text-muted-foreground">
            Cathédrales, basiliques, sanctuaires, abbayes et chemins de pèlerinage —
            une exploration respectueuse pour les chrétiens et les curieux.
          </p>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-col h-auto py-3 gap-1"
            onClick={() => navigate('/explore')}
          >
            <Map className="w-5 h-5 text-primary" />
            <span className="text-xs">Carte</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-3 gap-1"
            onClick={() => navigate('/places')}
          >
            <Church className="w-5 h-5 text-primary" />
            <span className="text-xs">Lieux</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-3 gap-1"
            onClick={() => navigate('/journal')}
          >
            <BookHeart className="w-5 h-5 text-primary" />
            <span className="text-xs">Collection</span>
          </Button>
        </section>

        {/* Featured sections */}
        <section className="space-y-3">
          {featured.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(item.path)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold leading-tight">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
                <Compass className="w-5 h-5 text-muted-foreground shrink-0" />
              </Card>
            );
          })}
        </section>

        {/* France pilot note */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Pilote France 🇫🇷</span> —
            La carte est centrée sur le patrimoine chrétien français. D'autres pays
            européens arrivent prochainement.
          </p>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home;
