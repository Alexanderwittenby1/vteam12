'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import BookingPanel from '../mobile/BookingPanel';

const MapComponent = dynamic(
  () => import('@/components/map/MapComponent'),
  { ssr: false }
);

interface Scooter {
  scooter_id: number;
  latitude: string;
  longitude: string;
  battery_level: string;
  status: string;
  is_available: number;
}

interface DynamicMapProps {
  token: string;
  userData: {
    user_id: number;
    balance: number;
  };
}

export default function DynamicMap({ token, userData }: DynamicMapProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);

  const handleScooterSelect = (scooter: Scooter) => {
    console.log('Selected scooter:', scooter);
    setSelectedScooter(scooter);
    setShowBooking(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 relative">
        <MapComponent 
          token={token}
          className="absolute inset-0"
          onScooterSelect={handleScooterSelect}
        />
      </div>
      
      {selectedScooter && (
        <BookingPanel 
          show={showBooking}
          onClose={() => {
            setShowBooking(false);
            setSelectedScooter(null);
          }}
          userData={userData}
          scooter={selectedScooter}
        />
      )}
    </div>
  );
}