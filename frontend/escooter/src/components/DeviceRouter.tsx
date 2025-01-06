// src/components/DeviceRouter.tsx
import { useDeviceDetection } from './map/useDeviceDetection';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface DeviceRouterProps {
  children: React.ReactNode;
}

const DeviceRouter: React.FC<DeviceRouterProps> = ({ children }) => {
  const { isMobile, isLoading } = useDeviceDetection();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isMobile && router.pathname === '/dashboard') {
      router.push('/map');
    }
  }, [isMobile, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default DeviceRouter;