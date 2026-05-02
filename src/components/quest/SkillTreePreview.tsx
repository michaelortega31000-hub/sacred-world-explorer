import { Card } from '@/components/ui/card';
import { BookText, Building2, Church, Heart, ScrollText, ChevronRight } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;       // 0..5
  Icon: typeof BookText;
  color: string;
}

const SKILLS: Skill[] = [
  { id: 'scripture',    name: 'Écritures',     level: 2, Icon: BookText,   color: '#F4C542' },
  { id: 'liturgy',      name: 'Liturgie',      level: 1, Icon: Church, color: '#C084FC' },
  { id: 'prayer',       name: 'Prière',        level: 3, Icon: Heart,      color: '#F87171' },
  { id: 'history',      name: 'Histoire',      level: 2, Icon: ScrollText, color: '#7DD3FC' },
  { id: 'architecture', name: 'Architecture',  level: 1, Icon: Building2,  color: '#86EFAC' },
];

interface Props {
  onOpen?: () => void;
}

// Compact 5-domain spiritual skill grid. Tap to navigate to full skill tree.
export const SkillTreePreview = ({ onOpen }: Props) => (
  <Card className="cg-amethyst p-3">
    <div className="flex items-center justify-between px-1 mb-2">
      <h2 className="text-[13px] font-semibold text-white tracking-wide">
        Vos disciplines spirituelles
      </h2>
      <button
        onClick={onOpen}
        className="text-[11px] text-purple-200 hover:text-purple-100 transition-colors flex items-center gap-0.5"
      >
        Détail <ChevronRight className="w-3 h-3" />
      </button>
    </div>

    <div className="grid grid-cols-5 gap-2">
      {SKILLS.map((s) => (
        <SkillNode key={s.id} skill={s} />
      ))}
    </div>
  </Card>
);

const SkillNode = ({ skill }: { skill: Skill }) => {
  const filled = skill.level;
  return (
    <button
      className="group flex flex-col items-center gap-1.5 px-1 py-2 rounded-lg
                 hover:bg-white/5 active:scale-95 transition-all"
    >
      <div
        className="relative w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${skill.color}30, ${skill.color}10)`,
          border: `1.5px solid ${skill.color}60`,
          boxShadow: `0 0 12px ${skill.color}40`,
        }}
      >
        <skill.Icon className="w-4 h-4" style={{ color: skill.color }} />
      </div>
      <span className="text-[10px] text-white/85 leading-tight text-center">{skill.name}</span>
      {/* Level pips */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full"
            style={{
              background: i <= filled ? skill.color : 'rgba(255,255,255,0.15)',
              boxShadow: i <= filled ? `0 0 4px ${skill.color}` : undefined,
            }}
          />
        ))}
      </div>
    </button>
  );
};
