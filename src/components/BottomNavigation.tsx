import { useNavigate, useLocation } from 'react-router-dom';
import { User, Globe, Route, BookHeart } from 'lucide-react';

// Flat 4-tab nav — no floating orb. Globe gets a permanent gold tint to
// signal it's the primary destination.
const NAV_ITEMS = [
  { icon: User,      label: 'Profil',    path: '/profile',         gold: false },
  { icon: Route,     label: 'Planifier', path: '/planner',         gold: false },
  { icon: Globe,     label: 'Globe',     path: '/explore?tab=map', gold: true  },
  { icon: BookHeart, label: 'Journal',   path: '/journal',         gold: false },
] as const;

const ACCENT = {
  gold:    { color: '#F4C542', glow: 'rgba(244,197,66,0.60)', ring: 'rgba(244,197,66,0.30)' },
  default: { color: '#34E0A1', glow: 'rgba(52,224,161,0.50)', ring: 'rgba(52,224,161,0.18)' },
};

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path.split('?')[0];

  return (
    <>
      {/* Fade scrim */}
      <div
        aria-hidden
        className="fixed bottom-0 left-0 right-0 h-24 z-40 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(7,7,15,0.7) 55%, rgba(7,7,15,0.96) 100%)' }}
      />

      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-lg px-4 pb-4">
          <div
            className="rounded-2xl"
            style={{
              background: 'linear-gradient(160deg, rgba(22,48,92,0.72) 0%, rgba(12,24,58,0.88) 100%)',
              backdropFilter: 'blur(22px) saturate(160%)',
              WebkitBackdropFilter: 'blur(22px) saturate(160%)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.07) inset, 0 0 0 1px rgba(244,197,66,0.12) inset, 0 -2px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Gold hairline */}
            <div className="absolute top-0 inset-x-4 h-px rounded-t-2xl" style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(244,197,66,0.5) 30%, rgba(244,197,66,0.7) 50%, rgba(244,197,66,0.5) 70%, transparent 100%)',
            }} />

            <ul className="grid grid-cols-4">
              {NAV_ITEMS.map((item) => {
                const Icon   = item.icon;
                const active = isActive(item.path);
                const accent = item.gold ? ACCENT.gold : ACCENT.default;

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      aria-current={active ? 'page' : undefined}
                      className="relative w-full h-14 flex flex-col items-center justify-end pb-2 gap-0.5
                                 transition-transform duration-150 active:scale-95"
                    >
                      {active && (
                        <>
                          <span aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
                            style={{ height: 28, background: `linear-gradient(180deg, transparent 0%, ${accent.glow} 60%, ${accent.color} 100%)`, opacity: 0.9 }} />
                          <span aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full"
                            style={{ background: accent.color, boxShadow: `0 0 6px 2px ${accent.glow}` }} />
                          <span aria-hidden className="absolute bottom-7 left-1/2 rounded-full"
                            style={{ width: 36, height: 36, background: `radial-gradient(circle, ${accent.ring} 0%, transparent 70%)`, transform: 'translate(-50%, 50%)' }} />
                        </>
                      )}
                      <Icon
                        className="w-[18px] h-[18px] relative z-10"
                        style={{
                          color: active ? accent.color : item.gold ? 'rgba(244,197,66,0.65)' : 'rgba(255,255,255,0.50)',
                          filter: active ? `drop-shadow(0 0 5px ${accent.glow})` : 'none',
                          transition: 'color 200ms, filter 200ms',
                        }}
                      />
                      <span
                        className="text-[10px] font-medium leading-none relative z-10 tracking-wide"
                        style={{
                          color: active ? accent.color : item.gold ? 'rgba(244,197,66,0.65)' : 'rgba(255,255,255,0.40)',
                          transition: 'color 200ms',
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
