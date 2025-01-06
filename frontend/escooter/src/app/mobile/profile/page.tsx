'use client';

import React, { useEffect, useState } from 'react';
import MobileProfile from '@/components/mobile/MobileProfile';
import MobileNavBar from '@/components/MobileNavBar';
import { fetchUserData } from '@/services/fetchUserData';

export default function MobileProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      setUser(userData);
      setLoading(false);
    };
    getUserData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileProfile user={user} />
      <MobileNavBar />
    </div>
  );
}