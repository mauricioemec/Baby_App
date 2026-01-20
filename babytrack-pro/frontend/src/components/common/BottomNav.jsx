import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Heart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: t('nav.dashboard') || 'Dashboard'
    },
    {
      path: '/charts',
      icon: BarChart3,
      label: t('nav.charts') || 'Charts'
    },
    {
      path: '/health',
      icon: Heart,
      label: t('nav.health') || 'Health'
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('nav.settings') || 'Settings'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-touch transition-colors ${
                active
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : ''}`} />
              <span className={`mt-1 text-xs ${active ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
