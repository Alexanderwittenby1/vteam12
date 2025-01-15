import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { fetchUserData } from '../../../services/fetchUserData';
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const user = await fetchUserData(token);

  // Redirect if no user data (includes unauthorized cases)
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="d-flex" style={{ height: "100vh", width: "100%" }}>
      <div style={{ flex: "0 0 280px", height: "100%" }}>
        <Sidebar user={user} />
      </div>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;