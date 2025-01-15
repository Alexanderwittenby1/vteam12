'use client';

import { MapIcon, ClockIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MobileNavBarProps = {
  activeTab: 'map' | 'history' | 'profile';
  onTabChange: (tab: 'map' | 'history' | 'profile') => void;
};

export default function MobileNavBar({ activeTab, onTabChange }: MobileNavBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    {
      id: 'map',
      icon: MapIcon,
      label: 'Map',
    },
    {
      id: 'history',
      icon: ClockIcon,
      label: 'History',
    },
    {
      id: 'profile',
      icon: UserIcon,
      label: 'Profile',
    },
    {
      id: 'logout',
      icon: LogOutIcon,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    onTabChange(item.id as 'map' | 'history' | 'profile');
                  }
                }}
                className="flex flex-col items-center py-2 px-6 relative group"
              >
                <Icon 
                  className={`h-6 w-6 transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-600 scale-110' 
                      : 'text-gray-500 group-hover:text-blue-400 group-hover:scale-105'
                  }`}
                />
                <span 
                  className={`text-xs mt-1 transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </span>

                {/* Small dot indicator */}
                <div 
                  className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 
                    w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-blue-600 opacity-100' : 'opacity-0'
                  }`} 
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}