import { useEffect, useRef, useState } from 'react';
import { Crown } from 'lucide-react';

interface Props {
  totalXp: number;
}

// Premium XP bar: count-up animation on totalXp changes, shimmer overlay, level chip.
export const XPBar = ({ totalXp }: Props) => {
  const [displayed, setDisplayed] = useState(totalXp);
  const fromRef = useRef(totalXp);

  useEffect(() => {
    if (totalXp === displayed) return;
    const from = fromRef.current;
    const to = totalXp;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalXp, displayed]);

  const level = Math.floor(displayed / 100) + 1;
  const xpInLevel = displayed % 100;
  const xpToNext = 100 - xpInLevel;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide
                       bg-gradient-to-r from-amber-300/25 to-orange-400/25
                       border border-amber-300/40 text-amber-200"
          >
            <Crown className="w-3 h-3" />
            Niveau {level}
          </span>
          <span className="text-[11px] text-white/60 tabular-nums">
            {displayed} XP
          </span>
        </div>
        <span className="text-[11px] text-white/55 tabular-nums">
          encore <strong className="text-white/80">{xpToNext}</strong> XP
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 shadow-[0_0_10px_rgba(244,197,66,0.55)] relative"
          style={{ width: `${xpInLevel}%`, transition: 'width 800ms cubic-bezier(.2,.7,.2,1)' }}
        >
          <div className="hub-shimmer-bar" />
        </div>
      </div>
    </div>
  );
};
