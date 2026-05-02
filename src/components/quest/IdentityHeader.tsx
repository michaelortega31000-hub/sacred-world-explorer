import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { TrackEmblem } from './TrackEmblem';
import type { Track } from '@/types/track';

interface Props {
  greeting: string;
  firstName?: string;
  track: Track | null;
  trackLabel: string;
  totalXp: number;
  // optional: how many quests/badges/whatever to next milestone — overrides the
  // ring's "100 XP per level" default if provided.
  toMilestone?: { current: number; goal: number; label: string };
}

// Identity-first header: large avatar with XP-progress ring, name + tiny track
// chip, and a Réglages affordance moved here (out of the bottom nav). Drops the
// horizontal XP bar, the redundant counters, and the trophy icon competition.
export const IdentityHeader = ({
  greeting,
  firstName = 'Pèlerin',
  track,
  trackLabel,
  totalXp,
  toMilestone,
}: Props) => {
  const navigate = useNavigate();

  // Default ring: % progress toward next 100-XP level boundary.
  const ringPct = toMilestone
    ? Math.min(100, (toMilestone.current / Math.max(1, toMilestone.goal)) * 100)
    : (totalXp % 100);

  const milestoneText = toMilestone
    ? `${toMilestone.goal - toMilestone.current} ${toMilestone.label}`
    : `Niv. ${Math.floor(totalXp / 100) + 1} · ${100 - (totalXp % 100)} XP`;

  return (
    <header
      className="px-4 pt-5 pb-3 sticky top-0 z-30"
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        background: 'linear-gradient(180deg, rgba(7,7,15,0.92) 0%, rgba(7,7,15,0.60) 70%, transparent 100%)',
        borderBottom: '1px solid rgba(200,150,20,0.12)',
        boxShadow: '0 1px 0 rgba(200,150,20,0.08)',
      }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 group text-left"
          aria-label="Voir mon profil"
        >
          <RingedAvatar track={track} pct={ringPct} />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              {greeting}
            </div>
            <div className="text-[16px] font-semibold text-white">
              {firstName}
            </div>
            <div className="text-[10.5px] text-amber-200/80 mt-0.5 truncate max-w-[200px]">
              {milestoneText}
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-full border border-white/12 bg-white/5
                     hover:bg-white/10 active:scale-95 transition-all
                     flex items-center justify-center"
          aria-label="Réglages"
        >
          <SettingsIcon className="w-4 h-4 text-white/65" />
        </button>
      </div>
    </header>
  );
};

const RingedAvatar = ({ track, pct }: { track: Track | null; pct: number }) => {
  const size = 56;
  const r = 25;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, pct)) / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* progress ring */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#identity-ring-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ filter: 'drop-shadow(0 0 6px rgba(244,197,66,0.55))' }}
        />
        <defs>
          <linearGradient id="identity-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#F4C542" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
        </defs>
      </svg>
      {/* avatar core = track emblem (placeholder until photo upload exists here) */}
      <div className="absolute inset-[5px] rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 40% 35%, rgba(40,40,80,0.9), rgba(7,7,18,0.98))',
          border: '1px solid rgba(200,150,20,0.25)',
          boxShadow: '0 0 12px rgba(200,150,20,0.15) inset',
        }}
      >
        <TrackEmblem track={track} size={36} />
      </div>
    </div>
  );
};
