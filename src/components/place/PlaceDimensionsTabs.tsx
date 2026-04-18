import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  BookOpen,
  Clock,
  HeartHandshake,
  Cross,
  Building2,
  ScrollText,
  Lightbulb,
  Info,
  Headphones,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAudioGuide } from '@/hooks/useAudioGuide';
import { useApp } from '@/contexts/AppContext';

interface PlaceDimensionsTabsProps {
  placeId?: string;
  placeName: string;
  placeType: string;
  description: string;
}

const dailyPrayers = [
  {
    title: 'Notre Père',
    text: 'Notre Père qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite sur la terre comme au ciel…',
  },
  {
    title: 'Je vous salue Marie',
    text: 'Je vous salue Marie, pleine de grâce, le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes…',
  },
  {
    title: 'Prière du soir',
    text: 'Seigneur, au terme de cette journée, je te confie ce qui a été vécu, et je dépose entre tes mains ce qui sera demain.',
  },
];

// Versets bibliques (Louis Segond, domaine public) — affichés pour le profil Protestant
const protestantVerses = [
  {
    title: 'Psaume 23, 1',
    text: "L'Éternel est mon berger : je ne manquerai de rien.",
  },
  {
    title: 'Jean 3, 16',
    text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
  },
  {
    title: 'Romains 8, 28',
    text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu.",
  },
  {
    title: 'Philippiens 4, 13',
    text: "Je puis tout par celui qui me fortifie.",
  },
  {
    title: 'Ésaïe 40, 31',
    text: "Ceux qui se confient en l'Éternel renouvellent leur force.",
  },
];

const archStyles: Record<string, { style: string; description: string }> = {
  Cathédrale: {
    style: 'Gothique',
    description:
      "Voûtes sur croisée d'ogives, arcs-boutants, vitraux monumentaux et flèches élancées vers le ciel — l'art gothique cherche la lumière et la verticalité, transformant la pierre en dentelle.",
  },
  Basilique: {
    style: 'Roman / Néo-byzantin',
    description:
      "Volumes massifs, arcs en plein cintre et coupoles dorées : les basiliques associent solidité romane et richesse décorative byzantine, souvent rehaussées de mosaïques.",
  },
  Sanctuaire: {
    style: 'Néo-gothique / Contemporain',
    description:
      "Souvent érigés autour d'un lieu d'apparition ou d'une relique, les sanctuaires mêlent architectures du XIXᵉ siècle et aménagements modernes pour accueillir des foules de pèlerins.",
  },
  Abbaye: {
    style: 'Roman & Gothique',
    description:
      "Cloître, salle capitulaire, église abbatiale et scriptorium : l'architecture monastique structure prière, travail et vie communautaire selon la règle bénédictine ou cistercienne.",
  },
  Église: {
    style: 'Roman / Gothique / Baroque',
    description:
      "Selon l'époque, l'église paroissiale combine sobriété romane, élégance gothique ou exubérance baroque, reflet du goût et de la dévotion de chaque siècle.",
  },
  Chapelle: {
    style: 'Roman / Baroque / Contemporain',
    description:
      "Édifice plus modeste, la chapelle privilégie l'intimité du recueillement. Souvent dédiée à un saint, elle marque un lieu de mémoire ou un vœu particulier.",
  },
  Monastère: {
    style: 'Roman / Byzantin',
    description:
      "Ensemble fortifié et autonome, le monastère articule espaces de vie, de prière et de production. Les monastères orthodoxes reprennent la tradition byzantine, riche en icônes.",
  },
};

const PlaceDimensionsTabs = ({ placeId, placeName, placeType, description }: PlaceDimensionsTabsProps) => {
  const [intentionName, setIntentionName] = useState('');
  const [intentionText, setIntentionText] = useState('');
  const { state: audioState, play: playAudio, stop: stopAudio } = useAudioGuide();
  const { userProgress } = useApp();
  const denomination = userProgress.denomination ?? 'curieux';

  const todayPrayer = useMemo(() => {
    const day = new Date().getDate();
    return dailyPrayers[day % dailyPrayers.length];
  }, []);

  const todayVerse = useMemo(() => {
    const day = new Date().getDate();
    return protestantVerses[day % protestantVerses.length];
  }, []);

  const arch = archStyles[placeType] ?? archStyles['Église'];

  // Catholique → prière du jour ; Protestant → verset du jour
  const todaySpiritual = denomination === 'protestant' ? todayVerse : todayPrayer;

  const handlePrayerAudio = () => {
    if (audioState.isPlaying) {
      stopAudio();
      return;
    }
    playAudio(`${todaySpiritual.title}. ${todaySpiritual.text}`, placeId ?? `prayer-${Date.now()}`);
  };

  const handleSubmitIntention = () => {
    if (!intentionText.trim()) {
      toast.error('Merci d’écrire votre intention de prière.');
      return;
    }
    toast.success('Votre intention a été déposée 🕯️', {
      description: 'Elle sera portée dans la prière de la communauté SacredWorld.',
    });
    setIntentionName('');
    setIntentionText('');
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-5">
        <Tabs defaultValue={denomination === 'curieux' ? 'culturelle' : 'spirituelle'} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="spirituelle" className="gap-1.5 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" />
              Spirituelle
            </TabsTrigger>
            <TabsTrigger value="culturelle" className="gap-1.5 text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" />
              Culturelle
            </TabsTrigger>
          </TabsList>

          {/* === DIMENSION SPIRITUELLE === */}
          <TabsContent value="spirituelle" className="space-y-4 pt-4">
            {denomination === 'curieux' ? (
              // Curieux : bloc minimal, sans messes ni intention
              <section>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Cross className="w-4 h-4 text-primary" />
                  Lieu de recueillement
                </h3>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ce lieu reste avant tout un espace de silence et de respect, ouvert à toutes et à tous.
                    Que vous soyez croyant ou simplement curieux, prenez le temps d'observer, d'écouter, et
                    de ressentir l'atmosphère unique qui s'en dégage.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Pour découvrir l'histoire et l'architecture, consultez l'onglet « Culturelle ».
                  </p>
                </div>
              </section>
            ) : (
              <>
                {/* Horaires : Messes (Catholique) ou Cultes & temples (Protestant) */}
                <section>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {denomination === 'protestant' ? 'Cultes & temples' : 'Horaires des messes'}
                  </h3>
                  <div className="rounded-lg border border-border/60 divide-y text-sm">
                    {denomination === 'protestant' ? (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-muted-foreground">Dimanche</span>
                          <span className="font-medium">10h30 (culte principal)</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-muted-foreground">Mercredi</span>
                          <span className="font-medium">19h00 (étude biblique)</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-muted-foreground">Vendredi</span>
                          <span className="font-medium">20h00 (prière)</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-muted-foreground">Lundi → Vendredi</span>
                          <span className="font-medium">8h00 · 18h30</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-muted-foreground">Samedi</span>
                          <span className="font-medium">9h00 · 18h00</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-muted-foreground">Dimanche</span>
                          <span className="font-medium">9h00 · 11h00 · 18h00</span>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Horaires indicatifs — à confirmer auprès du lieu.
                  </p>
                </section>

                {/* Prière du jour (Catholique) / Verset du jour (Protestant) */}
                <section>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    {denomination === 'protestant' ? (
                      <BookOpen className="w-4 h-4 text-primary" />
                    ) : (
                      <Cross className="w-4 h-4 text-primary" />
                    )}
                    {denomination === 'protestant' ? 'Verset du jour' : 'Prière du jour'}
                  </h3>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-2">
                    <p className="text-sm font-semibold mb-1">{todaySpiritual.title}</p>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      « {todaySpiritual.text} »
                    </p>
                    {denomination === 'protestant' && (
                      <p className="text-[10px] text-muted-foreground">
                        Traduction Louis Segond (domaine public) — indicatif.
                      </p>
                    )}
                    <Button
                      onClick={handlePrayerAudio}
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-2"
                      disabled={audioState.isLoading}
                    >
                      {audioState.isPlaying ? (
                        <>
                          <Square className="w-4 h-4" />
                          Arrêter l'audio
                        </>
                      ) : (
                        <>
                          <Headphones className="w-4 h-4" />
                          {denomination === 'protestant' ? 'Écouter le verset' : 'Audio guide prière'}
                        </>
                      )}
                    </Button>
                  </div>
                </section>

                {/* Intention / Sujet de prière */}
                <section>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <HeartHandshake className="w-4 h-4 text-primary" />
                    {denomination === 'protestant' ? 'Déposer un sujet de prière' : 'Déposer une intention de prière'}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="intention-name" className="text-xs">
                        Votre prénom (optionnel)
                      </Label>
                      <Input
                        id="intention-name"
                        placeholder="Ex. Marie"
                        value={intentionName}
                        onChange={(e) => setIntentionName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="intention-text" className="text-xs">
                        {denomination === 'protestant' ? 'Votre sujet de prière' : 'Votre intention'}
                      </Label>
                      <Textarea
                        id="intention-text"
                        placeholder="Pour qui ou pour quoi souhaitez-vous prier ?"
                        value={intentionText}
                        onChange={(e) => setIntentionText(e.target.value)}
                        className="mt-1 min-h-[90px]"
                        maxLength={500}
                      />
                    </div>
                    <Button onClick={handleSubmitIntention} className="w-full">
                      🕯️ {denomination === 'protestant' ? 'Confier ce sujet' : 'Déposer mon intention'}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Votre demande reste confidentielle.
                    </p>
                  </div>
                </section>
              </>
            )}
          </TabsContent>

          {/* === DIMENSION CULTURELLE === */}
          <TabsContent value="culturelle" className="space-y-4 pt-4">
            {/* Style architectural */}
            <section>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                Style architectural
              </h3>
              <Badge variant="outline" className="mb-2">
                {arch.style}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">{arch.description}</p>
            </section>

            {/* Faits historiques */}
            <section>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <ScrollText className="w-4 h-4 text-primary" />
                Faits historiques
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span className="text-muted-foreground">
                    Édifice emblématique du patrimoine religieux européen, témoin de plusieurs siècles d’histoire.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span className="text-muted-foreground">
                    Lieu de pèlerinage, de couronnement ou d’événements marquants pour la communauté chrétienne.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span className="text-muted-foreground">
                    Plusieurs campagnes de restauration ont permis de préserver ses œuvres d’art, vitraux et reliques.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold shrink-0">•</span>
                  <span className="text-muted-foreground">
                    {description?.slice(0, 160) ?? 'Un lieu unique du patrimoine sacré.'}…
                  </span>
                </li>
              </ul>
            </section>

            {/* Anecdotes */}
            <section>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Le saviez-vous ?
              </h3>
              <div className="space-y-2">
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-xs font-semibold mb-1">Détail d’architecte</p>
                  <p className="text-sm text-muted-foreground">
                    Les bâtisseurs médiévaux signaient parfois leur travail par de petites sculptures dissimulées dans les chapiteaux ou les gargouilles.
                  </p>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-xs font-semibold mb-1">Légende locale</p>
                  <p className="text-sm text-muted-foreground">
                    De nombreux lieux sacrés sont entourés de récits transmis de génération en génération — apparitions, miracles, ou prodiges populaires.
                  </p>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-xs font-semibold mb-1">Curiosité</p>
                  <p className="text-sm text-muted-foreground">
                    Observez les vitraux : leur orientation Est-Ouest filtre la lumière du matin et du soir, créant des ambiances très différentes selon les heures.
                  </p>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlaceDimensionsTabs;
