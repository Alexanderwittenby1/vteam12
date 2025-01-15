'use client';

import { useState } from 'react';
import DynamicMap from '@/components/map/DynamicMap';
import ClientMobileProfile from '@/components/mobile/MobileProfile';
import ClientMobileHistory from '@/components/mobile/ClientMobileHistory';
import MobileNavBar from '@/components/MobileNavBar';

type TabType = 'map' | 'history' | 'profile';

interface User {
  user_id: number;
  email: string;
  name?: string;
}

type ClientMobileViewProps = {
  initialUser: User;
  initialTrips: any[];
  token: string;
};

export default function ClientMobileView({ initialUser, initialTrips, token }: ClientMobileViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('map');

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <div className="absolute inset-0 bottom-14">
            <DynamicMap token={token} userData={initialUser} />
          </div>
        );
      case 'history':
        return (
          <div className="absolute inset-0 bottom-14 overflow-y-auto">
            <div className="min-h-full bg-gray-100">
              <ClientMobileHistory 
                initialUser={initialUser}
                initialTrips={initialTrips} 
              />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="absolute inset-0 bottom-14 overflow-y-auto">
            <div className="min-h-full bg-gray-100">
              <ClientMobileProfile initialUser={initialUser} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0">
      {renderContent()}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white z-50">
        <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}