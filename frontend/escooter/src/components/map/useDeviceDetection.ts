// src/components/map/useDeviceDetection.ts
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isLoading: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkDevice = () => {
      // Check if window is defined (client-side)
      if (typeof window !== 'undefined') {
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                             window.innerWidth <= 768;
        
        setDeviceInfo({
          isMobile: isMobileDevice,
          isLoading: false,
        });
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceInfo;
};