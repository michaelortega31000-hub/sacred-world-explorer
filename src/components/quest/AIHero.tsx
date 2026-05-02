import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Send, Sparkles, MessageCircle, Plus } from 'lucide-react';
import { useAssistant } from '@/App';

interface Props {
  greeting: string;
  trackLabel: string;
  firstName?: string;
}

const SUGGESTIONS_BY_TRACK: Record<string, string[]> = {
  catholic: [
    'Recommande-moi un pèlerinage cette saison',
    'Raconte-moi un saint d\'aujourd\'hui',
    'Quelle quête spirituelle pour aujourd\'hui ?',
    'Explique-moi la liturgie du jour',
  ],
  protestant: [
    'Quel verset méditer aujourd\'hui ?',
    'Recommande un lieu chargé d\'histoire de la Réforme',
    'Aide-moi à structurer ma prière',
    'Donne-moi une quête spirituelle simple',
  ],
  orthodox: [
    'Que fête l\'Église aujourd\'hui ?',
    'Raconte-moi une icône célèbre',
    'Quel Père de l\'Église méditer ?',
    'Suggère un lieu byzantin proche',
  ],
  heritage: [
    'Quel chef-d\'œuvre roman visiter cette semaine ?',
    'Raconte l\'histoire de Notre-Dame',
    'Comment lire l\'iconographie d\'un tympan ?',
    'Compose-moi un itinéraire patrimoine',
  ],
};

export const AIHero = ({ greeting, trackLabel, firstName = 'Pèlerin' }: Props) => {
  const { setIsOpen } = useAssistant();
  const [draft, setDraft] = useState('');
  const [showMore, setShowMore] = useState(false);

  // Map UI label → track key (keeps suggestion variants coherent).
  const trackKey =
    trackLabel.toLowerCase().includes('catho') ? 'catholic' :
    trackLabel.toLowerCase().includes('protest') ? 'protestant' :
    trackLabel.toLowerCase().includes('ortho') ? 'orthodox' : 'heritage';

  const suggestions = SUGGESTIONS_BY_TRACK[trackKey];

  // Rotating, conversational placeholder — feels like an invitation, not a search bar.
  const PROMPTS = [
    'Demandez-moi un pèlerinage de week-end…',
    '…un saint à découvrir aujourd\'hui…',
    '…un verset pour ce moment…',
    '…un lieu sacré près d\'ici…',
    '…un itinéraire pour vos vacances…',
  ];
  const [promptIdx, setPromptIdx] = useState(0);
  useEffect(() => {
    if (draft) return;
    const id = setInterval(() => setPromptIdx((i) => (i + 1) % PROMPTS.length), 3500);
    return () => clearInterval(id);
  }, [draft]);

  const send = (text: string) => {
    if (!text.trim()) return;
    // Toast-like cue — real prompt-injection into the assistant chat happens
    // when the assistant component reads the URL hash on open.
    window.location.hash = `#assistant=${encodeURIComponent(text)}`;
    setIsOpen(true);
  };

  return (
    <Card className="hub-card-glow relative overflow-hidden bg-gradient-to-br from-[#15265e]/70 via-[#1a3a72]/55 to-[#0E1B3F]/70 backdrop-blur-md border-amber-300/25 p-5">
      {/* aura blobs */}
      <div className="absolute -top-16 -left-12 w-56 h-56 rounded-full bg-amber-300/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-14 w-44 h-44 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />
      {/* twinkle particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="hub-mote"
          style={{
            top: `${10 + Math.random() * 75}%`,
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${(Math.random() * 3).toFixed(1)}s`,
            transform: `scale(${(0.5 + Math.random()).toFixed(2)})`,
          }}
        />
      ))}

      <div className="relative">
        {/* Avatar + intro */}
        <div className="flex items-start gap-3 mb-4">
          <AssistantAvatar />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/80">
              {greeting}, {firstName}
            </p>
            <h2 className="font-cinzel text-[20px] leading-tight text-white mt-0.5 [text-wrap:balance]">
              Je suis votre guide spirituel
            </h2>
            <p className="text-[12.5px] text-white/65 leading-snug mt-1">
              Confiez-moi votre intention — je vous propose le pas suivant.
            </p>
          </div>
        </div>

        {/* Suggestion chips — collapsed by default to reduce first-paint density */}
        {showMore && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11.5px] leading-snug px-3 py-1.5 rounded-full
                           bg-white/5 hover:bg-amber-300/15 hover:border-amber-300/40
                           border border-white/10 text-white/80 hover:text-amber-100
                           transition-colors active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Free-form input */}
        <div
          className="relative flex items-center gap-2 px-3 py-2 rounded-xl
                     bg-black/35 border border-amber-300/20
                     focus-within:border-amber-300/60 focus-within:shadow-[0_0_18px_rgba(244,197,66,0.2)]
                     transition-all"
        >
          <MessageCircle className="w-4 h-4 text-amber-200/80 shrink-0" />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (send(draft), setDraft(''))}
            placeholder={PROMPTS[promptIdx]}
            className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/45 placeholder:transition-opacity"
          />
          <button
            onClick={() => { send(draft); setDraft(''); }}
            disabled={!draft.trim()}
            aria-label="Envoyer"
            className="w-8 h-8 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950
                       disabled:opacity-30 disabled:from-white/20 disabled:to-white/10 disabled:text-white/50
                       active:scale-90 transition-transform shadow-[0_0_10px_rgba(244,197,66,0.5)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tiny "more ideas" toggle — keeps the hero quiet by default */}
        <button
          onClick={() => setShowMore((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-[10.5px] text-white/45
                     hover:text-amber-200 transition-colors"
        >
          <Plus
            className={`w-3 h-3 transition-transform ${showMore ? 'rotate-45' : ''}`}
            strokeWidth={2.5}
          />
          {showMore ? 'Moins d\'idées' : 'Plus d\'idées'}
        </button>
      </div>
    </Card>
  );
};

// Animated assistant avatar — concentric halo + sparkle dot.
const AssistantAvatar = () => (
  <div className="relative w-12 h-12 shrink-0">
    {/* halo rings */}
    <span className="absolute inset-0 rounded-full border border-amber-300/40 animate-[ping_2.6s_ease-out_infinite]" />
    <span className="absolute inset-1 rounded-full border border-amber-300/25 animate-[ping_2.6s_ease-out_infinite]" style={{ animationDelay: '0.7s' }} />
    {/* core */}
    <div
      className="absolute inset-1.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-300 to-orange-400 flex items-center justify-center hub-breath"
      style={{ boxShadow: '0 0 18px rgba(244,197,66,0.7), inset 0 0 12px rgba(255,255,255,0.4)' }}
    >
      <Sparkles className="w-4 h-4 text-amber-950" />
    </div>
  </div>
);
