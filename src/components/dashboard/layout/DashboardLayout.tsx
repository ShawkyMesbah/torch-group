"use client";

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import DashboardSidebar from './Sidebar';
import DashboardProvider from './Provider';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#111827] flex">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
} 