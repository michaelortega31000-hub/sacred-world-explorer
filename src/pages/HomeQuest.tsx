import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Globe2, Heart, MapPin, Users } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { StreakRing } from '@/components/quest/StreakRing';
import { CheckInModal } from '@/components/quest/CheckInModal';
import { AIHero } from '@/components/quest/AIHero';
import { SpiritualGlobe } from '@/components/quest/SpiritualGlobe';
import { CollectionStrip } from '@/components/quest/CollectionStrip';
import { SkillTreePreview } from '@/components/quest/SkillTreePreview';
import { IdentityHeader } from '@/components/quest/IdentityHeader';
import { NextActionCard } from '@/components/quest/NextActionCard';
import {
  AuroraBg, QuestCard, NearbyCard, LeaderboardCard,
  QuickActionTile, SectionHeader, SupporterCard,
  type NearbyPlace, type LeaderboardEntry,
} from '@/components/quest/QuestPieces';
import { useApp } from '@/contexts/AppContext';
import type { Track } from '@/types/track';

const TRACK_LABEL: Record<Track, string> = {
  catholic: 'Catholique',
  protestant: 'Protestant',
  orthodox: 'Orthodoxe',
  heritage: 'Curieux & Patrimoine',
};

const NEARBY: NearbyPlace[] = [
  { id: 'sainte-chapelle',  name: 'Sainte-Chapelle',     city: 'Paris',  distance_km: 0.8, multiplier: 1.0 },
  { id: 'notre-dame',       name: 'Notre-Dame de Paris', city: 'Paris',  distance_km: 1.2, multiplier: 1.0 },
  { id: 'mont-saint-michel',name: 'Mont-Saint-Michel',   city: 'Manche', distance_km: 358, multiplier: 2.4 },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Marie L.',    xp: 4820 },
  { rank: 2, name: 'Pierre D.',   xp: 3940 },
  { rank: 3, name: 'Jeanne C.',   xp: 3215 },
  { rank: 4, name: 'Vous',        xp: 0,    isMe: true },
  { rank: 5, name: 'François M.', xp: 2870 },
];

const HomeQuest = () => {
  const navigate = useNavigate();
  const { userProgress } = useApp();
  const track = (useApp() as any).track as 'catholic' | 'protestant' | 'orthodox' | 'heritage' | undefined;
  const [checkInPlace, setCheckInPlace] = useState<{ id: string; name: string } | null>(null);

  const trackLabel = track ? TRACK_LABEL[track] : 'Curieux & Patrimoine';

  const hoursSinceLastClaim = useMemo(() => {
    if (!userProgress.lastQuestDate) return undefined;
    const last = new Date(userProgress.lastQuestDate).getTime();
    if (isNaN(last)) return undefined;
    return (Date.now() - last) / 3600_000;
  }, [userProgress.lastQuestDate]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 6)  return 'Belle nuit';
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    if (h < 22) return 'Bonsoir';
    return 'Bonne soirée';
  }, []);

  const leaderboard = useMemo<LeaderboardEntry[]>(
    () => LEADERBOARD.map((row) => row.isMe ? { ...row, xp: userProgress.totalPoints ?? 0 } : row),
    [userProgress.totalPoints],
  );

  // Placeholder counts — wired to real DB tables in Phase 2.7+ (badges) and
  // future tokens/skills tables.
  const collection = {
    badges: userProgress.badges?.length ?? 3,
    tokens: 7,
    skills: 5,
  };

  // The single recommended next action. Heuristic for now; eventually a backend
  // `next-action` edge function picks from: nearby visit, daily feast, streak
  // save, in-progress quest, daily devotional.
  const primarySuggestion = useMemo(() => {
    const nearest = NEARBY[0];
    if (nearest && nearest.distance_km < 5) {
      return {
        kind: 'visit' as const,
        verb: `Découvrir ${nearest.name} ce soir`,
        detail: `${nearest.city} · à ${nearest.distance_km} km · ${nearest.multiplier}× XP`,
        reward: '+30 XP',
        onAct: () => setCheckInPlace({ id: nearest.id, name: nearest.name }),
      };
    }
    if ((userProgress.currentStreak ?? 0) > 0 && (hoursSinceLastClaim ?? 0) > 18) {
      return {
        kind: 'streak' as const,
        verb: 'Préserver votre série du jour',
        detail: `${userProgress.currentStreak} jours de quête · ne brisez pas le fil`,
        reward: '+10 XP',
        onAct: () => navigate('/explore?tab=challenges'),
      };
    }
    return {
      kind: 'devotional' as const,
      verb: 'Méditer le verset du soir',
      detail: 'Une minute de lecture · 1 token de grâce',
      reward: '+1 🪙',
      onAct: () => navigate('/journal'),
    };
  }, [hoursSinceLastClaim, navigate, userProgress.currentStreak]);

  return (
    <AuroraBg>
      <div className="pb-28">
        {/* IDENTITY-FIRST HEADER — avatar w/ XP ring, name, track chip, settings affordance */}
        <IdentityHeader
          greeting={greeting}
          firstName="Pèlerin"
          track={track}
          trackLabel={trackLabel}
          totalXp={userProgress.totalPoints ?? 0}
        />

        <main className="px-4 pt-3 space-y-4">
          {/* ONE HERO ACTION — the single most valuable next step right now */}
          <NextActionCard suggestion={primarySuggestion} />

          {/* AI COMPANION — protagonist, conversational opener */}
          <AIHero greeting={greeting} trackLabel={trackLabel} />

          {/* HORIZON — letterbox mini-globe with the 3 nearest sacred sites */}
          <SpiritualGlobe
            onExplore={() => navigate('/explore')}
            compact
            maxMarkers={3}
          />

          {/* VOIR CE QUE VOUS AVEZ GAGNÉ — collection counts */}
          <CollectionStrip
            badges={collection.badges}
            tokens={collection.tokens}
            skills={collection.skills}
            onOpen={(which) => {
              if (which === 'badges') navigate('/badges');
              if (which === 'tokens') navigate('/profile');
              if (which === 'skills') navigate('/profile');
            }}
          />

          {/* DÉBLOQUER UNE COMPÉTENCE — skill tree preview */}
          <SkillTreePreview onOpen={() => navigate('/profile')} />

          {/* DAILY QUEST + STREAK */}
          <div className="grid grid-cols-3 gap-3">
            <QuestCard
              title="Méditer un verset et répondre au quiz"
              subtitle="3 questions · entretien de votre série · 30 XP"
              rewardXp={30}
              onClaim={() => navigate('/explore?tab=challenges')}
            />
            <div className="cg-amber flex flex-col items-center justify-center rounded-xl p-3 relative overflow-hidden">
              <StreakRing
                streak={userProgress.currentStreak ?? 0}
                longest={userProgress.longestStreak ?? 0}
                hoursSinceLastClaim={hoursSinceLastClaim}
              />
              <p className="text-[10px] text-white/60 mt-1">Série active</p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-4 gap-2.5">
            <QuickActionTile Icon={Globe2}  label="Globe"   onClick={() => navigate('/explore')}                accent="amber" />
            <QuickActionTile Icon={MapPin}  label="Lieux"   onClick={() => navigate('/places')}                 accent="sky" />
            <QuickActionTile Icon={Compass} label="Quiz"    onClick={() => navigate('/explore?tab=challenges')} accent="emerald" />
            <QuickActionTile Icon={Heart}   label="Journal" onClick={() => navigate('/journal')}                accent="rose" />
          </div>

          {/* NEARBY (Pokémon-GO vibe) */}
          <section>
            <SectionHeader
              Icon={MapPin}
              title="Lieux à proximité"
              cta={{ label: 'Voir tout', onClick: () => navigate('/explore') }}
            />
            <div className="space-y-2">
              {NEARBY.map((p) => (
                <NearbyCard
                  key={p.id}
                  place={p}
                  onCheckIn={() => setCheckInPlace({ id: p.id, name: p.name })}
                />
              ))}
            </div>
          </section>

          {/* COMMUNITY LEADERBOARD */}
          <section>
            <SectionHeader
              Icon={Users}
              title={`Communauté ${trackLabel} · cette semaine`}
              cta={{ label: 'Voir tout', onClick: () => navigate('/explore?tab=rankings') }}
            />
            <LeaderboardCard entries={leaderboard} />
          </section>

          {/* PREMIUM SUPPORTER TEASER */}
          <SupporterCard onClick={() => navigate('/settings')} />

          <p className="text-center text-[10px] text-white/40 pt-2 italic">
            « Tout ce que vous faites, faites-le pour la gloire de Dieu. » — 1 Cor 10:31
          </p>
        </main>
      </div>

      <CheckInModal
        open={!!checkInPlace}
        onOpenChange={(o) => !o && setCheckInPlace(null)}
        place={checkInPlace}
      />

      <BottomNavigation />
    </AuroraBg>
  );
};

export default HomeQuest;
