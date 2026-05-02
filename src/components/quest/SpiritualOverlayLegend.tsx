import { Award, Coins, Star } from 'lucide-react';
import { spiritualCounts, SPIRITUAL_TYPE_COLOR } from './spiritualOverlay';

// Floating glass-morph legend for the spiritual overlay on the real 3D globe.
// Sits bottom-right, never a full-width bar.
export const SpiritualOverlayLegend = () => {
  const counts = spiritualCounts();
  return (
    <div
      className="absolute z-30 right-3 flex items-center gap-1 px-1.5 py-1 rounded-full pointer-events-none"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 152px)',
        background: 'linear-gradient(180deg, rgba(20,43,79,0.55) 0%, rgba(14,27,63,0.82) 100%)',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        boxShadow:
          '0 0 0 1px rgba(255,255,255,0.06) inset, 0 12px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(244,197,66,0.10)',
      }}
    >
      <Chip color={SPIRITUAL_TYPE_COLOR.badge.core} icon={Award} count={counts.badge} label="Badges" />
      <Chip color={SPIRITUAL_TYPE_COLOR.token.core} icon={Coins} count={counts.token} label="Tokens" />
      <Chip color={SPIRITUAL_TYPE_COLOR.skill.core} icon={Star}  count={counts.skill} label="Skills" />
    </div>
  );
};

const Chip = ({
  color,
  icon: Icon,
  count,
  label,
}: {
  color: string;
  icon: typeof Award;
  count: number;
  label: string;
}) => (
  <div
    className="flex items-center gap-1.5 px-2 py-1 rounded-full"
    style={{ background: 'rgba(255,255,255,0.04)' }}
    aria-label={`${count} ${label}`}
  >
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}90` }}
    >
      <Icon className="w-2.5 h-2.5 text-black" strokeWidth={3} />
    </span>
    <span className="text-[10px] font-semibold text-white tabular-nums">{count}</span>
  </div>
);
