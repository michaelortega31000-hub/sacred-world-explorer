import { Award, Coins, Star, ChevronRight } from 'lucide-react';

interface Props {
  badges: number;
  tokens: number;
  skills: number;
  onOpen?: (which: 'badges' | 'tokens' | 'skills') => void;
}

export const CollectionStrip = ({ badges, tokens, skills, onOpen }: Props) => (
  <div className="grid grid-cols-3 gap-2.5">
    {/* Unified palette — same warm gold/parchment for all three. Categories
        are distinguished by icon shape and label, not by category color. */}
    <JewelPane
      Icon={Award}
      label="Badges"
      count={badges}
      iconColor="rgba(244,197,66,0.85)"
      onClick={() => onOpen?.('badges')}
    />
    <JewelPane
      Icon={Coins}
      label="Tokens"
      count={tokens}
      iconColor="rgba(244,197,66,0.85)"
      onClick={() => onOpen?.('tokens')}
    />
    <JewelPane
      Icon={Star}
      label="Skills"
      count={skills}
      iconColor="rgba(244,197,66,0.85)"
      onClick={() => onOpen?.('skills')}
    />
  </div>
);

const JewelPane = ({
  Icon, label, count, iconColor, onClick,
}: {
  Icon: typeof Award; label: string; count: number;
  iconColor: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="cg-lead cg-interactive relative overflow-hidden rounded-xl p-3 text-left"
  >
    <div className="relative flex items-center gap-1.5 mb-2.5">
      <Icon className="w-4 h-4 shrink-0" style={{ color: iconColor }} />
      <span
        className="text-[9.5px] tracking-[0.20em] uppercase font-semibold text-white/65"
      >
        {label}
      </span>
    </div>

    <div className="relative flex items-end justify-between">
      <span className="text-[28px] leading-none font-semibold tabular-nums text-white/95">
        {count}
      </span>
      <ChevronRight className="w-3.5 h-3.5 mb-1 text-white/35" />
    </div>
  </button>
);
