import { Flame } from 'lucide-react';

interface Props {
  streak: number;
  longest: number;
  // Hours since the last quest claim. Drives the "danger" UX once > 18h.
  hoursSinceLastClaim?: number;
}

// Duolingo-style ring with breathing glow. Goes red & pulsing when the daily
// streak is in danger of breaking (>18h since last claim).
export const StreakRing = ({ streak, longest, hoursSinceLastClaim }: Props) => {
  const target = Math.max(7, longest, 1);
  const pct = Math.min(1, streak / target);
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  const danger = !!hoursSinceLastClaim && hoursSinceLastClaim > 18 && streak > 0;
  const accent = danger ? '#EF4444' : '#F4C542';
  const accent2 = danger ? '#B91C1C' : '#FF7A29';

  return (
    <div className={`relative w-24 h-24 flex items-center justify-center ${danger ? 'rounded-full hub-streak-danger' : ''}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor={accent} />
            <stop offset="100%" stopColor={accent2} />
          </linearGradient>
          <radialGradient id="streakHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#streakHaloGrad)" />
        <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.10)" strokeWidth="6" fill="none" />
        <circle
          cx="50" cy="50" r={r}
          stroke="url(#streakGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.7,.2,1)' }}
        />
      </svg>

      {/* orbiting dot */}
      {streak > 0 && (
        <span
          className="hub-orbit-dot absolute"
          style={{ top: '50%', left: '50%', marginTop: -3, marginLeft: -3, background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
      )}

      <div className="text-center relative z-10">
        <Flame
          className={`w-5 h-5 mx-auto ${danger ? 'text-red-300' : 'text-amber-300'}`}
          style={{
            filter: `drop-shadow(0 0 8px ${danger ? 'rgba(239,68,68,0.7)' : 'rgba(244,197,66,0.7)'})`,
          }}
        />
        <div className="text-2xl font-bold text-white leading-none tabular-nums">{streak}</div>
        <div className="text-[10px] text-white/70 uppercase tracking-wider">jours</div>
      </div>
    </div>
  );
};
