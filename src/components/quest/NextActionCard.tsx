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

const visualFor = (k: Kind) => {
  switch (k) {
    case 'visit':
      return {
        Icon: MapPin,
        eyebrowLabel: 'Près de vous',
        eyebrow: '#7DD3FC',
        bg: 'linear-gradient(135deg, rgba(8,30,68,0.85) 0%, rgba(11,46,110,0.78) 100%)',
        border: 'rgba(125,211,252,0.35)',
        shadow: '0 0 0 1px rgba(125,211,252,0.10), 0 14px 32px rgba(8,16,40,0.55), 0 0 28px rgba(125,211,252,0.18)',
        iconBg: 'linear-gradient(135deg, rgba(125,211,252,0.25), rgba(125,211,252,0.05))',
        iconColor: '#7DD3FC',
        glow: 'rgba(125,211,252,0.35)',
        rewardBg: 'rgba(125,211,252,0.12)',
        rewardColor: '#bfeeff',
        rewardBorder: 'rgba(125,211,252,0.45)',
      };
    case 'feast':
      return {
        Icon: Sparkles,
        eyebrowLabel: 'Aujourd\'hui',
        eyebrow: '#F4C542',
        bg: 'linear-gradient(135deg, rgba(48,28,8,0.78) 0%, rgba(70,42,12,0.78) 100%)',
        border: 'rgba(244,197,66,0.35)',
        shadow: '0 0 0 1px rgba(244,197,66,0.10), 0 14px 32px rgba(8,16,40,0.55), 0 0 28px rgba(244,197,66,0.20)',
        iconBg: 'linear-gradient(135deg, rgba(244,197,66,0.30), rgba(244,197,66,0.05))',
        iconColor: '#F4C542',
        glow: 'rgba(244,197,66,0.40)',
        rewardBg: 'rgba(244,197,66,0.15)',
        rewardColor: '#fde68a',
        rewardBorder: 'rgba(244,197,66,0.55)',
      };
    case 'streak':
      return {
        Icon: Flame,
        eyebrowLabel: 'Votre série',
        eyebrow: '#FB923C',
        bg: 'linear-gradient(135deg, rgba(50,18,8,0.82) 0%, rgba(90,30,12,0.78) 100%)',
        border: 'rgba(251,146,60,0.35)',
        shadow: '0 0 0 1px rgba(251,146,60,0.10), 0 14px 32px rgba(8,16,40,0.55), 0 0 28px rgba(251,146,60,0.20)',
        iconBg: 'linear-gradient(135deg, rgba(251,146,60,0.30), rgba(251,146,60,0.05))',
        iconColor: '#FB923C',
        glow: 'rgba(251,146,60,0.40)',
        rewardBg: 'rgba(251,146,60,0.15)',
        rewardColor: '#fed7aa',
        rewardBorder: 'rgba(251,146,60,0.55)',
      };
    case 'devotional':
    default:
      return {
        Icon: BookOpen,
        eyebrowLabel: 'Pour vous, ce soir',
        eyebrow: '#C084FC',
        bg: 'linear-gradient(135deg, rgba(28,12,52,0.82) 0%, rgba(46,18,80,0.78) 100%)',
        border: 'rgba(192,132,252,0.35)',
        shadow: '0 0 0 1px rgba(192,132,252,0.10), 0 14px 32px rgba(8,16,40,0.55), 0 0 28px rgba(192,132,252,0.20)',
        iconBg: 'linear-gradient(135deg, rgba(192,132,252,0.30), rgba(192,132,252,0.05))',
        iconColor: '#C084FC',
        glow: 'rgba(192,132,252,0.40)',
        rewardBg: 'rgba(192,132,252,0.15)',
        rewardColor: '#e9d5ff',
        rewardBorder: 'rgba(192,132,252,0.55)',
      };
  }
};
