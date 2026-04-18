import { useNavigate, useLocation } from 'react-router-dom';
import { User, Globe, Route, BookHeart, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: User, label: 'Profil', path: '/profile', highlight: false },
    { icon: Globe, label: 'Globe', path: '/explore', highlight: false },
    { icon: Route, label: 'Planifier', path: '/planner', highlight: true },
    { icon: BookHeart, label: 'Journal', path: '/journal', highlight: false },
    { icon: Settings, label: 'Réglages', path: '/settings', highlight: false },
  ];

  const isActive = (path: string) => {
    const cleanPath = path.split('?')[0];
    return location.pathname === cleanPath;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20"
      style={{
        background:
          'linear-gradient(180deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 -4px 20px rgba(52, 224, 161, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-2 py-1">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isGolden = item.highlight;
            const activeColor = isGolden ? '#F4C542' : 'hsl(var(--primary))';
            const glowColor = isGolden
              ? 'rgba(244, 197, 66, 0.7)'
              : 'rgba(52, 224, 161, 0.6)';

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-md transition-all duration-300 ${
                  active
                    ? ''
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={
                  active
                    ? {
                        color: activeColor,
                        filter: `drop-shadow(0 0 ${isGolden ? '10px' : '8px'} ${glowColor})`,
                      }
                    : isGolden
                      ? { filter: 'drop-shadow(0 0 6px rgba(244, 197, 66, 0.35))' }
                      : {}
                }
              >
                <Icon
                  className="w-4 h-4"
                  style={isGolden && !active ? { color: '#F4C542' } : undefined}
                />
                <span
                  className="text-[8px] font-medium"
                  style={isGolden && !active ? { color: '#F4C542' } : undefined}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
