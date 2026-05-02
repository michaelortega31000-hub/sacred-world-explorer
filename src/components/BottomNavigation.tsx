import { useNavigate, useLocation } from 'react-router-dom';
import { User, Globe, BookHeart } from 'lucide-react';

// Tab definition. `hero` = center elevated orb treatment (Globe).
const NAV_ITEMS = [
  { icon: User,      label: 'Profil',  path: '/profile',         gold: false, hero: false },
  { icon: Globe,     label: 'Globe',   path: '/explore?tab=map', gold: false, hero: true  },
  { icon: BookHeart, label: 'Journal', path: '/journal',         gold: false, hero: false },
] as const;

// Per-tab accent colours
const ACCENT = {
  hero:    { color: '#F4C542', glow: 'rgba(244,197,66,0.60)', ring: 'rgba(244,197,66,0.35)' },
  default: { color: '#34E0A1', glow: 'rgba(52,224,161,0.50)', ring: 'rgba(52,224,161,0.18)' },
};

const BottomNavigation = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (path: string) => location.pathname === path.split('?')[0];

  const handleNav = (item: typeof NAV_ITEMS[number]) => {
    if (item.hero) {
      navigate('/explore?tab=map', { state: { resetToMap: Date.now() } });
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Soft fade so scrollable content dissolves into the nav */}
      <div
        aria-hidden
        className="fixed bottom-0 left-0 right-0 h-24 z-40 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.65) 55%, rgba(10,22,40,0.95) 100%)',
        }}
      />

      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-md px-4 pb-4">
          {/* Wrapper — no overflow-hidden so the Globe orb can float above */}
          <div className="relative">

            {/* ── Globe hero orb ── floats above the bar ───────────────────── */}
            {(() => {
              const item   = NAV_ITEMS[1]; // Globe
              const active = isActive(item.path);
              const Icon   = item.icon;
              return (
                <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10 flex flex-col items-center">
                  {/* Outer ambient glow */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      width: 64, height: 64,
                      top: -6, left: '50%', transform: 'translateX(-50%)',
                      background: active
                        ? 'radial-gradient(circle, rgba(244,197,66,0.45) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(244,197,66,0.18) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      transition: 'background 300ms ease',
                    }}
                  />
                  {/* Orb button */}
                  <button
                    onClick={() => handleNav(item)}
                    aria-current={active ? 'page' : undefined}
                    className="relative flex items-center justify-center w-14 h-14 rounded-full
                               transition-transform duration-200 active:scale-90"
                    style={{
                      background: active
                        ? 'linear-gradient(145deg, #F4C542 0%, #e8aa1a 100%)'
                        : 'linear-gradient(145deg, rgba(30,56,110,0.95) 0%, rgba(18,32,72,0.95) 100%)',
                      boxShadow: active
                        ? '0 0 0 2px rgba(244,197,66,0.9), 0 0 24px rgba(244,197,66,0.55), 0 4px 16px rgba(0,0,0,0.5)'
                        : '0 0 0 1.5px rgba(244,197,66,0.4), 0 4px 16px rgba(0,0,0,0.5)',
                      transition: 'background 300ms ease, box-shadow 300ms ease',
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{
                        color: active ? '#0A1628' : '#F4C542',
                        transition: 'color 250ms ease',
                      }}
                    />
                  </button>
                  {/* Label below orb, sitting inside the bar height */}
                  <span
                    className="text-[9px] font-semibold tracking-wide mt-0.5"
                    style={{
                      color: active ? '#F4C542' : 'rgba(244,197,66,0.65)',
                      transition: 'color 250ms ease',
                      textShadow: active ? '0 0 8px rgba(244,197,66,0.6)' : 'none',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })()}

            {/* ── Glass bar ────────────────────────────────────────────────── */}
            <div
              className="relative rounded-2xl"
              style={{
                background:
                  'linear-gradient(160deg, rgba(22,48,92,0.72) 0%, rgba(12,24,58,0.88) 100%)',
                backdropFilter: 'blur(22px) saturate(160%)',
                WebkitBackdropFilter: 'blur(22px) saturate(160%)',
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,0.07) inset,' +
                  '0 0 0 1px rgba(244,197,66,0.12) inset,' +
                  '0 -2px 32px rgba(0,0,0,0.5)',
              }}
            >
              {/* Golden top hairline */}
              <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(244,197,66,0.5) 30%, rgba(244,197,66,0.7) 50%, rgba(244,197,66,0.5) 70%, transparent 100%)',
                }} />

              <ul className="grid grid-cols-3 px-1">
                {NAV_ITEMS.map((item, idx) => {
                  const Icon   = item.icon;
                  const active = isActive(item.path);

                  // Hero (Globe) slot — just reserves space, actual button is above
                  if (item.hero) {
                    return (
                      <li key={item.path} className="h-14 flex items-end justify-center pb-1" aria-hidden>
                        {/* intentionally empty — Globe orb floats above */}
                      </li>
                    );
                  }

                  const accent = ACCENT.default;

                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNav(item)}
                        aria-current={active ? 'page' : undefined}
                        className="relative w-full h-14 flex flex-col items-center justify-end pb-2 gap-0.5
                                   transition-transform duration-150 active:scale-95"
                      >
                        {/* Active upward beam — echoes the sacred-site light pillars on the map */}
                        {active && (
                          <>
                            {/* hairline beam */}
                            <span
                              aria-hidden
                              className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
                              style={{
                                height: 28,
                                background: `linear-gradient(180deg, transparent 0%, ${accent.glow} 60%, ${accent.color} 100%)`,
                                opacity: 0.9,
                              }}
                            />
                            {/* top dot */}
                            <span
                              aria-hidden
                              className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full"
                              style={{ background: accent.color, boxShadow: `0 0 6px 2px ${accent.glow}` }}
                            />
                            {/* soft icon halo */}
                            <span
                              aria-hidden
                              className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full"
                              style={{
                                width: 36, height: 36,
                                background: `radial-gradient(circle, ${accent.ring} 0%, transparent 70%)`,
                                transform: 'translate(-50%, 50%)',
                              }}
                            />
                          </>
                        )}

                        <Icon
                          className="w-[18px] h-[18px] relative z-10"
                          style={{
                            color: active ? accent.color : 'rgba(255,255,255,0.55)',
                            filter: active ? `drop-shadow(0 0 5px ${accent.glow})` : 'none',
                            transition: 'color 200ms ease, filter 200ms ease',
                          }}
                        />
                        <span
                          className="text-[10px] font-medium leading-none relative z-10 tracking-wide"
                          style={{
                            color: active ? accent.color : 'rgba(255,255,255,0.45)',
                            transition: 'color 200ms ease',
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
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
