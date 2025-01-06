import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MapIcon, UserIcon, LogOutIcon, HistoryIcon } from 'lucide-react';
import { useDeviceDetection } from './map/useDeviceDetection';


interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full px-1 py-2 space-y-1
      transition-all duration-300 ease-in-out relative
      ${isActive 
        ? 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:bg-blue-600 after:rounded-t-full' 
        : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
      }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
      {label}
    </span>
  </button>
);

const MobileNavBar = () => {
  const { isMobile } = useDeviceDetection();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (!isMobile || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_Admin');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const navItems = [
    {
      icon: <MapIcon className="h-5 w-5" />,
      label: 'Map',
      path: '/map',
      onClick: () => router.push('/map')
    },
    {
      icon: <HistoryIcon className="h-5 w-5" />,
      label: 'History',
      path: '/history',
      onClick: () => router.push('/history')
    },
    {
      icon: <UserIcon className="h-5 w-5" />,
      label: 'Profile',
      path: '/mobile/profile',
      onClick: () => router.push('/mobile/profile')
    },
    {
      icon: <LogOutIcon className="h-5 w-5" />,
      label: 'Logout',
      path: '/logout',
      onClick: handleLogout
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
      <nav className="bg-white border border-gray-200 rounded-2xl shadow-lg mx-auto max-w-md">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.path}
              onClick={item.onClick}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavBar;