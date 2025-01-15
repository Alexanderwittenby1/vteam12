'use client';

import { useDeviceDetection } from '@/components/map/useDeviceDetection';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuthToken } from '@/services/grabTokenFromCookies';
import DynamicMap from './DynamicMap';

export default function MapClientWrapper() {
  const { isMobile, isLoading: deviceLoading } = useDeviceDetection();
  const router = useRouter();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    if (!deviceLoading && !isMobile) {
      router.push('/scooters');
      return;
    }

    const userAuthToken = getAuthToken();
    if (!userAuthToken) {
      router.push('/login');
      return;
    }

    setToken(userAuthToken);
  }, [isMobile, deviceLoading, router]);

  if (deviceLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Preparing map view...</p>
        </div>
      </div>
    );
  }

  if (!isMobile || !token) {
    return null;
  }

  return <DynamicMap token={token} />;
}