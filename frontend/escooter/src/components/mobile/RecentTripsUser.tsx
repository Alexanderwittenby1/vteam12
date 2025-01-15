'use client';

import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, CreditCardIcon } from 'lucide-react';

interface User {
  user_id: number;
  email: string;
  name?: string;
}

interface RecentTripsUserProps {
  trips: any[];
  user: User;
}

const RecentTripsUser: React.FC<RecentTripsUserProps> = ({ trips = [], user }) => {
  // Ensure we have user data before rendering
  if (!user) {
    return <div className="p-4 text-gray-500">Loading user data...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationInSeconds = (endTime - startTime) / 1000;
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  // Sort trips by start_time in descending order (newest first)
  const sortedTrips = [...trips].sort((a, b) => {
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold p-4 border-b">
        Recent Trips for {user?.name || user?.email || 'User'}
      </h2>
      {!trips || trips.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No trips found.</p>
      ) : (
        <div className="p-4 space-y-4">
          {sortedTrips.map((trip, index) => (
            <div key={trip.trip_id || index} className="bg-gray-50 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{formatDate(trip.start_time)}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600 font-medium">
                  <CreditCardIcon className="w-5 h-5" />
                  <span>{trip.cost ? `${Number(trip.cost).toFixed(2)} kr` : 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{trip.distance ? `${Number(trip.distance).toFixed(2)} m` : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>{formatDuration(trip.start_time, trip.end_time)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTripsUser;