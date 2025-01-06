'use client';
import { useDeviceDetection } from '@/components/map/useDeviceDetection';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


const MapComponent = dynamic(
  () => import('@/components/map/MapComponent'),
  { ssr: false }
);

export default function MapPage() {
  const { isMobile, isLoading: deviceLoading } = useDeviceDetection();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthorized(!!token);

    if (!token) {
      router.push('/login');
    }

    if (!deviceLoading && !isMobile) {
      router.push('/scooters');
    }

    setMountKey(prev => prev + 1);
  }, [isMobile, deviceLoading, router]);

  if (deviceLoading || isAuthorized === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Preparing map view...</p>
        </div>
      </div>
    );
  }

  if (!isMobile || !isAuthorized) {
    return null;
  }

  return (
    <div className="h-screen w-full">
      <MapComponent key={mountKey} className="h-full" />
    </div>
  );
}