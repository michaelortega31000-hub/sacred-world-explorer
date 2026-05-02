import { Award, Coins, Star, ChevronRight } from 'lucide-react';

interface Props {
  badges: number;
  tokens: number;
  skills: number;
  onOpen?: (which: 'badges' | 'tokens' | 'skills') => void;
}

export const CollectionStrip = ({ badges, tokens, skills, onOpen }: Props) => (
  <div className="grid grid-cols-3 gap-2.5">
    <JewelPane
      Icon={Award}
      label="Badges"
      count={badges}
      glassCls="cg-ruby"
      iconColor="#F87171"
      glow="rgba(180,30,55,0.7)"
      onClick={() => onOpen?.('badges')}
    />
    <JewelPane
      Icon={Coins}
      label="Tokens"
      count={tokens}
      glassCls="cg-sapphire"
      iconColor="#60A5FA"
      glow="rgba(30,80,200,0.7)"
      onClick={() => onOpen?.('tokens')}
    />
    <JewelPane
      Icon={Star}
      label="Skills"
      count={skills}
      glassCls="cg-amethyst"
      iconColor="#C084FC"
      glow="rgba(100,30,180,0.7)"
      onClick={() => onOpen?.('skills')}
    />
  </div>
);

const JewelPane = ({
  Icon, label, count, glassCls, iconColor, glow, onClick,
}: {
  Icon: typeof Award; label: string; count: number;
  glassCls: string; iconColor: string; glow: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`${glassCls} cg-interactive relative overflow-hidden rounded-xl p-3 text-left`}
  >
    {/* Strong backlit glow from top */}
    <div
      className="absolute -top-4 inset-x-0 h-16 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow.replace('0.7', '0.35')} 0%, transparent 70%)` }}
    />

    <div className="relative flex items-center gap-1.5 mb-2.5">
      <Icon
        className="w-4 h-4 shrink-0"
        style={{ color: iconColor, filter: `drop-shadow(0 0 6px ${glow})` }}
      />
      <span
        className="text-[9.5px] tracking-[0.20em] uppercase font-bold"
        style={{ color: iconColor, opacity: 0.85 }}
      >
        {label}
      </span>
    </div>

    <div className="relative flex items-end justify-between">
      <span
        className="text-[28px] leading-none font-bold tabular-nums"
        style={{
          color: '#fff',
          textShadow: `0 0 20px ${glow}`,
        }}
      >
        {count}
      </span>
      <ChevronRight
        className="w-3.5 h-3.5 mb-1"
        style={{ color: iconColor, opacity: 0.6 }}
      />
    </div>
  </button>
);
