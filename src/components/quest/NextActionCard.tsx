import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, MapPin, Sparkles, Flame, BookOpen } from 'lucide-react';

type Kind = 'visit' | 'feast' | 'streak' | 'devotional';

interface Suggestion {
  kind: Kind;
  verb: string;       // imperative — what the user does next
  detail: string;     // the *why* — short, evocative
  reward?: string;    // optional reward badge
  onAct: () => void;
}

interface Props {
  // Caller supplies a concrete next action. If null, we render a soft fallback.
  suggestion: Suggestion | null;
}

// One hero action — replaces the four prompt chips. The user always sees the
// single most valuable verb the system can compute right now.
export const NextActionCard = ({ suggestion }: Props) => {
  const visual = useMemo(() => visualFor(suggestion?.kind ?? 'devotional'), [suggestion?.kind]);

  if (!suggestion) {
    return (
      <Card className="cg-lead relative overflow-hidden p-4 text-center">
        <p className="text-[11px] text-white/55 uppercase tracking-[0.18em]">Pour vous, ce soir</p>
        <p className="text-[14px] text-white/85 mt-1">Choisissez un lieu sur le globe pour commencer.</p>
      </Card>
    );
  }

  return (
    <Card
      className="relative overflow-hidden border p-0"
      style={{
        background: visual.bg,
        borderColor: visual.border,
        boxShadow: visual.shadow,
      }}
    >
      <button
        onClick={suggestion.onAct}
        className="w-full text-left p-4 flex items-center gap-3 group active:scale-[0.99] transition-transform"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: visual.iconBg,
            boxShadow: `0 0 14px ${visual.glow}`,
          }}
        >
          <visual.Icon className="w-5 h-5" style={{ color: visual.iconColor }} strokeWidth={2.4} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-0.5"
            style={{ color: visual.eyebrow }}
          >
            {visual.eyebrowLabel}
          </p>
          <p className="text-white font-semibold text-[15px] leading-snug truncate">
            {suggestion.verb}
          </p>
          <p className="text-white/65 text-[12px] leading-snug mt-0.5 truncate">
            {suggestion.detail}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {suggestion.reward && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: visual.rewardBg,
                color: visual.rewardColor,
                border: `1px solid ${visual.rewardBorder}`,
              }}
            >
              {suggestion.reward}
            </span>
          )}
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center
                       group-hover:translate-x-0.5 transition-transform"
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: `1px solid ${visual.border}`,
            }}
          >
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </span>
        </div>
      </button>
    </Card>
  );
};

// Single tonal palette — all action kinds share the same lead glass + gold
// accents. The icon shape and eyebrow label communicate the category;
// color is no longer the differentiator.
const PALETTE = {
  bg: 'linear-gradient(135deg, rgba(20,18,28,0.85) 0%, rgba(10,9,16,0.92) 100%)',
  border: 'rgba(244,197,66,0.18)',
  shadow:
    '0 0 0 1px rgba(255,255,255,0.025) inset, 0 14px 32px rgba(0,0,0,0.55), 0 0 24px rgba(244,197,66,0.06)',
  iconBg: 'linear-gradient(135deg, rgba(244,197,66,0.18), rgba(244,197,66,0.04))',
  iconColor: 'rgba(244,197,66,0.90)',
  glow: 'rgba(244,197,66,0.18)',
  eyebrow: 'rgba(244,197,66,0.70)',
  rewardBg: 'rgba(244,197,66,0.10)',
  rewardColor: 'rgba(254,235,165,0.95)',
  rewardBorder: 'rgba(244,197,66,0.35)',
};

const visualFor = (k: Kind) => {
  switch (k) {
    case 'visit':
      return { ...PALETTE, Icon: MapPin,    eyebrowLabel: 'Près de vous' };
    case 'feast':
      return { ...PALETTE, Icon: Sparkles,  eyebrowLabel: 'Aujourd\'hui' };
    case 'streak':
      return { ...PALETTE, Icon: Flame,     eyebrowLabel: 'Votre série' };
    case 'devotional':
    default:
      return { ...PALETTE, Icon: BookOpen,  eyebrowLabel: 'Pour vous, ce soir' };
  }
};
