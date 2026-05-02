import { Card } from '@/components/ui/card';
import { Award, Coins, Star, ChevronRight } from 'lucide-react';

interface Props {
  badges: number;
  tokens: number;
  skills: number;
  onOpen?: (which: 'badges' | 'tokens' | 'skills') => void;
}

export const CollectionStrip = ({ badges, tokens, skills, onOpen }: Props) => (
  <div className="grid grid-cols-3 gap-3">
    <Item
      Icon={Award}
      label="Badges"
      count={badges}
      colorFrom="from-amber-300/35"
      colorTo="to-amber-500/15"
      border="border-amber-300/40"
      iconColor="text-amber-200"
      glow="rgba(244,197,66,0.55)"
      onClick={() => onOpen?.('badges')}
    />
    <Item
      Icon={Coins}
      label="Tokens"
      count={tokens}
      colorFrom="from-cyan-300/35"
      colorTo="to-cyan-500/15"
      border="border-cyan-300/40"
      iconColor="text-cyan-200"
      glow="rgba(125,211,252,0.55)"
      onClick={() => onOpen?.('tokens')}
    />
    <Item
      Icon={Star}
      label="Skills"
      count={skills}
      colorFrom="from-purple-300/35"
      colorTo="to-purple-500/15"
      border="border-purple-300/40"
      iconColor="text-purple-200"
      glow="rgba(192,132,252,0.55)"
      onClick={() => onOpen?.('skills')}
    />
  </div>
);

const Item = ({
  Icon, label, count, colorFrom, colorTo, border, iconColor, glow, onClick,
}: {
  Icon: typeof Award; label: string; count: number;
  colorFrom: string; colorTo: string; border: string; iconColor: string; glow: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`hub-card-glow relative overflow-hidden rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} backdrop-blur-md border ${border} p-3 text-left
                hover:scale-[1.03] active:scale-95 transition-transform`}
  >
    <div
      className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
      style={{ background: glow }}
    />
    <div className="relative flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 ${iconColor}`} style={{ filter: `drop-shadow(0 0 6px ${glow})` }} />
      <span className="text-[10px] tracking-[0.18em] uppercase text-white/85 font-semibold">
        {label}
      </span>
    </div>
    <div className="relative flex items-end justify-between">
      <span className="text-[26px] leading-none font-bold text-white tabular-nums">
        {count}
      </span>
      <ChevronRight className="w-4 h-4 text-white/50" />
    </div>
  </button>
);
