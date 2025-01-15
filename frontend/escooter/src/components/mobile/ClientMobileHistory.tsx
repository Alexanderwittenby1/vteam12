'use client';

import React from 'react';
import RecentTripsUser from './RecentTripsUser';

interface User {
  user_id: number;
  email: string;
  name?: string;
}

interface ClientMobileHistoryProps {
  initialUser: User;
  initialTrips: any[];
}

const ClientMobileHistory: React.FC<ClientMobileHistoryProps> = ({ initialUser, initialTrips = [] }) => {
  if (!initialUser) {
    return (
      <div className="min-h-full bg-gray-100 p-4">
        <div className="text-center text-gray-500">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Trip History</h1>
      <RecentTripsUser 
        trips={initialTrips} 
        user={initialUser} 
      />
    </div>
  );
};

export default ClientMobileHistory;