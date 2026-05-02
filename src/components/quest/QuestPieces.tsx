import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen, ChevronRight, MapPin, Sparkles, Target, Volume2, Crown,
  Award, Medal, Loader2,
} from 'lucide-react';

// ============================================================================
// AuroraBg — animated mesh gradient background, with random gold motes.
// ============================================================================
export const AuroraBg = ({ children }: { children: ReactNode }) => {
  const motes = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        top: `${Math.round(Math.random() * 90)}%`,
        left: `${Math.round(Math.random() * 96)}%`,
        delay: `${(Math.random() * 4).toFixed(1)}s`,
        scale: (0.6 + Math.random() * 1.4).toFixed(2),
      })),
    [],
  );
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 hub-aurora hub-grain" />
      {/* radial vignette for focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, transparent 0%, rgba(0,0,0,0.45) 100%)',
        }}
      />
      {/* floating gold motes */}
      <div className="absolute inset-0 pointer-events-none">
        {motes.map((m, i) => (
          <span
            key={i}
            className="hub-mote"
            style={{
              top: m.top, left: m.left,
              animationDelay: m.delay,
              transform: `scale(${m.scale})`,
            }}
          />
        ))}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

// ============================================================================
// VerseCard — premium verse-of-the-day card with floating glow + audio CTA.
// ============================================================================
export const VerseCard = ({
  text,
  reference,
  onListen,
}: {
  text: string;
  reference: string;
  onListen?: () => void;
}) => (
  <Card className="hub-card-glow relative overflow-hidden bg-gradient-to-br from-[#1a3a72]/60 via-[#152a5e]/55 to-[#0E1B3F]/65 backdrop-blur-md border-amber-300/15 p-5">
    <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-300/15 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-amber-300" />
        <span className="text-[10px] tracking-[0.18em] uppercase text-amber-200/90 font-semibold">
          Verset du jour
        </span>
      </div>
      <p className="font-cinzel text-[19px] leading-[1.45] text-white italic mb-3 [text-wrap:balance]">
        {text}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-amber-200/80 tracking-wide">{reference}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onListen}
          className="h-8 text-amber-200 hover:bg-amber-300/10 hover:text-amber-100"
        >
          <Volume2 className="w-4 h-4 mr-1" /> Écouter
        </Button>
      </div>
    </div>
  </Card>
);

// ============================================================================
// QuestCard — primary daily quest with breathing CTA + glow halo.
// ============================================================================
export const QuestCard = ({
  title,
  subtitle,
  rewardXp,
  onClaim,
}: {
  title: string;
  subtitle: string;
  rewardXp: number;
  onClaim: () => void;
}) => (
  <Card className="hub-card-glow relative overflow-hidden col-span-2 bg-gradient-to-br from-[#1a2d5a]/70 to-[#0E1B3F]/70 backdrop-blur-md border-amber-300/20 p-4">
    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-amber-300/20 blur-2xl pointer-events-none" />
    <div className="relative">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-4 h-4 text-amber-300" />
        <span className="text-[10px] tracking-[0.18em] uppercase text-amber-300 font-semibold">
          Quête du jour
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-white leading-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-white/65 mb-3 leading-snug">{subtitle}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onClaim}
          className="hub-breath group relative inline-flex items-center gap-1.5 rounded-full px-4 h-9
                     bg-gradient-to-r from-amber-300 to-orange-400 text-[13px] font-semibold text-amber-950
                     shadow-[0_0_18px_rgba(244,197,66,0.55)] active:scale-95 transition-transform"
        >
          <span>Commencer</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-[11px] text-amber-200/85">+{rewardXp} XP</span>
      </div>
    </div>
  </Card>
);

// ============================================================================
// SectionHeader
// ============================================================================
export const SectionHeader = ({
  Icon,
  title,
  cta,
}: {
  Icon: typeof MapPin;
  title: string;
  cta?: { label: string; onClick: () => void };
}) => (
  <div className="flex items-center justify-between mb-3 px-1">
    <h2 className="flex items-center gap-2">
      {/* Tiny beam dot — echoes the map light pillars */}
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0"
        style={{
          background: 'rgba(244,197,66,0.12)',
          boxShadow: '0 0 10px rgba(244,197,66,0.25)',
        }}
      >
        <Icon
          className="w-3.5 h-3.5"
          style={{ color: '#F4C542', filter: 'drop-shadow(0 0 4px rgba(244,197,66,0.8))' }}
        />
      </span>
      <span
        className="text-[11px] font-bold tracking-[0.15em] uppercase"
        style={{ color: 'rgba(244,197,66,0.85)' }}
      >
        {title}
      </span>
    </h2>
    {cta && (
      <button
        onClick={cta.onClick}
        className="flex items-center gap-0.5 transition-colors"
        style={{ color: 'rgba(244,197,66,0.65)', fontSize: '11px' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,197,66,1)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,197,66,0.65)')}
      >
        {cta.label}
        <ChevronRight className="w-3 h-3" />
      </button>
    )}
  </div>
);

// ============================================================================
// NearbyCard — premium nearby place row with distance pill + check-in CTA.
// ============================================================================
export interface NearbyPlace {
  id: string;
  name: string;
  city: string;
  distance_km: number;
  multiplier: number;
}

export const NearbyCard = ({
  place,
  onCheckIn,
}: {
  place: NearbyPlace;
  onCheckIn: () => void;
}) => (
  <Card
    onClick={onCheckIn}
    className="hub-card-glow relative overflow-hidden bg-white/5 backdrop-blur-md border-white/10 p-3 flex items-center gap-3
               hover:bg-white/10 hover:border-amber-300/30 transition-all cursor-pointer
               active:scale-[0.99]"
  >
    {/* subtle animated edge highlight */}
    <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-transparent via-amber-300/0 to-transparent group-hover:via-amber-300/10" />
    <div
      className="w-11 h-11 rounded-full shrink-0 relative flex items-center justify-center
                 bg-gradient-to-br from-amber-300/25 to-amber-700/15 border border-amber-300/30"
    >
      <MapPin className="w-4 h-4 text-amber-200" />
      {place.multiplier > 1.5 && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-amber-300 to-orange-400 text-amber-950">
          ×{place.multiplier.toFixed(1)}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[14px] font-semibold text-white truncate">{place.name}</div>
      <div className="text-[11px] text-white/60 flex items-center gap-1.5">
        <span>{place.city}</span>
        <span className="opacity-50">·</span>
        <span className="tabular-nums">{place.distance_km.toFixed(1)} km</span>
      </div>
    </div>
    <Button
      size="sm"
      onClick={(e) => { e.stopPropagation(); onCheckIn(); }}
      className="bg-gradient-to-r from-amber-300/25 to-orange-400/25
                 hover:from-amber-300/40 hover:to-orange-400/40
                 border border-amber-300/40 text-amber-100 h-8 px-3 text-xs font-semibold"
    >
      Check-in
    </Button>
  </Card>
);

// ============================================================================
// LeaderboardCard — top-3 podium + your rank highlighted.
// ============================================================================
export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isMe?: boolean;
  avatar?: string;
}

export const LeaderboardCard = ({ entries }: { entries: LeaderboardEntry[] }) => {
  const top3 = entries.filter((e) => e.rank <= 3).sort((a, b) => a.rank - b.rank);
  const rest = entries.filter((e) => e.rank > 3).sort((a, b) => a.rank - b.rank);

  // Re-arrange for visual podium: 2 / 1 / 3
  const podium = [
    top3.find((e) => e.rank === 2),
    top3.find((e) => e.rank === 1),
    top3.find((e) => e.rank === 3),
  ].filter(Boolean) as LeaderboardEntry[];

  return (
    <Card className="hub-card-glow bg-white/5 backdrop-blur-md border-white/10 p-4 space-y-4">
      {/* Podium */}
      <div className="grid grid-cols-3 gap-2 items-end pt-1">
        {podium.map((e) => {
          const heights = { 1: 'h-20', 2: 'h-16', 3: 'h-14' } as const;
          const colors = {
            1: 'from-amber-300/40 to-amber-600/30 border-amber-300/60',
            2: 'from-slate-200/30 to-slate-400/20 border-slate-200/40',
            3: 'from-orange-400/30 to-orange-700/20 border-orange-400/40',
          } as const;
          const Ic = e.rank === 1 ? Crown : e.rank === 2 ? Medal : Award;
          return (
            <div key={e.rank} className="flex flex-col items-center hub-rank-rise" style={{ animationDelay: `${e.rank * 80}ms` }}>
              <Ic
                className={`w-5 h-5 mb-1 ${e.rank === 1 ? 'text-amber-300' : e.rank === 2 ? 'text-slate-200' : 'text-orange-300'}`}
                style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
              />
              <span className="text-[11px] text-white/85 truncate max-w-full">{e.name}</span>
              <span className="text-[10px] text-amber-200/85 tabular-nums">{e.xp} XP</span>
              <div
                className={`w-full ${heights[e.rank as 1 | 2 | 3]} rounded-t-md mt-1
                            bg-gradient-to-t ${colors[e.rank as 1 | 2 | 3]} border`}
              />
            </div>
          );
        })}
      </div>

      {/* Below-podium rows */}
      <div className="space-y-1 pt-1 border-t border-white/5">
        {rest.map((row, i) => (
          <div
            key={row.rank}
            className={`flex items-center gap-3 px-2 py-1.5 rounded-md hub-rank-rise
                        ${row.isMe ? 'bg-gradient-to-r from-amber-300/20 to-amber-300/0 border border-amber-300/30' : ''}`}
            style={{ animationDelay: `${(i + 4) * 60}ms` }}
          >
            <span className="text-[11px] font-semibold text-white/55 w-5 tabular-nums">#{row.rank}</span>
            <span className="text-[13px] text-white flex-1 truncate">
              {row.isMe ? <strong>{row.name}</strong> : row.name}
            </span>
            <span className="text-[12px] text-amber-200 font-semibold tabular-nums">{row.xp} XP</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ============================================================================
// QuickActionTile
// ============================================================================
export const QuickActionTile = ({
  Icon, label, onClick, accent = 'amber',
}: {
  Icon: typeof MapPin;
  label: string;
  onClick: () => void;
  accent?: 'amber' | 'sky' | 'rose' | 'emerald';
}) => {
  const palette = {
    amber:   'from-amber-300/25 to-amber-500/10 border-amber-300/30 text-amber-200',
    sky:     'from-sky-300/25 to-sky-500/10 border-sky-300/30 text-sky-200',
    rose:    'from-rose-300/25 to-rose-500/10 border-rose-300/30 text-rose-200',
    emerald: 'from-emerald-300/25 to-emerald-500/10 border-emerald-300/30 text-emerald-200',
  }[accent];

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl
                  bg-gradient-to-br ${palette} backdrop-blur-md border
                  hover:scale-[1.04] active:scale-95 transition-transform`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[11px] font-medium text-white/90">{label}</span>
    </button>
  );
};

// ============================================================================
// SkeletonRow — used while data loads.
// ============================================================================
export const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
    <div className="w-10 h-10 rounded-full bg-white/10" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-2/3 rounded bg-white/10" />
      <div className="h-2.5 w-1/3 rounded bg-white/10" />
    </div>
    <Loader2 className="w-4 h-4 animate-spin text-white/30" />
  </div>
);

// ============================================================================
// SupporterCard — ethical premium teaser.
// ============================================================================
export const SupporterCard = ({ onClick }: { onClick?: () => void }) => (
  <Card className="hub-card-glow relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/10 border-amber-300/30 p-5 text-center">
    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
    <Sparkles className="w-7 h-7 text-amber-300 mx-auto mb-2" style={{ filter: 'drop-shadow(0 0 8px rgba(244,197,66,0.7))' }} />
    <h3 className="text-[15px] font-cinzel text-white mb-1">Soutenir SacredWorld</h3>
    <p className="text-xs text-white/70 leading-snug max-w-md mx-auto mb-3">
      Membre Premium : assistant illimité, voix audio, contenus approfondis, cosmétiques.
      Une part est reversée à des œuvres caritatives chrétiennes.
    </p>
    <Button
      size="sm"
      onClick={onClick}
      className="bg-gradient-to-r from-amber-300 to-orange-400 text-amber-950 hover:opacity-90 font-semibold"
    >
      Découvrir Premium
    </Button>
  </Card>
);
