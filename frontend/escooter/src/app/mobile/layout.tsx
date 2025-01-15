import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile View - E-Scooter App',
  description: 'Mobile interface for the e-scooter rental application',
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}