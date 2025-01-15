import { Suspense } from 'react';
import ClientMobileView from './ClientMobileView';
import { getAuthToken } from '@/services/grabTokenFromCookies';
import { fetchUserData } from '@/services/fetchUserData';
import { fetchTripData } from '@/services/fetchUserTrips';

async function MobileContent() {
  try {
    const userAuthToken = await getAuthToken();
    const userData = await fetchUserData(userAuthToken);
    const tripData = await fetchTripData(userAuthToken);

    if (!userData) {
      throw new Error('Failed to load user data');
    }

    return (
      <ClientMobileView 
        initialUser={userData} 
        initialTrips={tripData || []} 
        token={userAuthToken} 
      />
    );
  } catch (error) {
    console.error('Error loading mobile content:', error);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">Failed to load data. Please try again.</div>
      </div>
    );
  }
}

export default function MobilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    }>
      <MobileContent />
    </Suspense>
  );
}