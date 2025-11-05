import { useNavigate, useLocation } from 'react-router-dom';
import { BookHeart, User, Settings } from 'lucide-react';
const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [{
    icon: BookHeart,
    label: 'Journal',
    path: '/journal'
  }, {
    icon: User,
    label: 'Profil',
    path: '/profile'
  }, {
    icon: Settings,
    label: 'Réglages',
    path: '/settings'
  }];
  const isActive = (path: string) => {
    if (path.includes('?tab=')) {
      const [pathname, query] = path.split('?');
      const params = new URLSearchParams(query);
      const tab = params.get('tab');
      const currentParams = new URLSearchParams(location.search);
      const currentTab = currentParams.get('tab');
      return location.pathname === pathname && currentTab === tab;
    }
    return location.pathname === path;
  };
  return <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20" style={{
    background: 'linear-gradient(180deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 -4px 20px rgba(52, 224, 161, 0.1)'
  }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return <button key={item.path} onClick={() => navigate(item.path)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all duration-300 ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`} style={active ? {
            filter: 'drop-shadow(0 0 8px rgba(52, 224, 161, 0.6))'
          } : {}}>
                
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>;
        })}
        </div>
      </div>
    </nav>;
};
export default BottomNavigation;