"use client";

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { PanelLeft, Settings, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  userInfo: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    isAdmin: boolean;
  };
}

export default function AdminLayoutClient({ children, userInfo }: AdminLayoutProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Torch Admin
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {userInfo.isAdmin && (
            <div className="flex space-x-2">
              <Link href="/dashboard/users">
                <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400 font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400 font-medium">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium">
            Notifications
          </Button>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6 overflow-auto flex-1 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
} 