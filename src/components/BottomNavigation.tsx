import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Church, BookHeart, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/home' },
    { icon: Map, label: 'Carte', path: '/explore' },
    { icon: Church, label: 'Lieux', path: '/places' },
    { icon: BookHeart, label: 'Collection', path: '/journal' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

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
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-md transition-all duration-300 ${
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                style={
                  active
                    ? { filter: 'drop-shadow(0 0 8px rgba(52, 224, 161, 0.6))' }
                    : {}
                }
              >
                <Icon className="w-4 h-4" />
                <span className="text-[8px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
