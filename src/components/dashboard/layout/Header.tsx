"use client";

import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-[#1a2234] border-b border-gray-800 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image 
            src="/images/logo.png" 
            alt="Torch Group" 
            width={32} 
            height={32} 
            className="rounded-full"
          />
          <span className="font-semibold text-white">Dashboard</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className={cn(
          "p-2 rounded-full transition-colors duration-200",
          "hover:bg-[#1e2943] text-gray-400 hover:text-white"
        )}>
          <Bell className="w-5 h-5" />
        </button>
        
        <Link 
          href="/dashboard/settings" 
          className={cn(
            "p-2 rounded-full transition-colors duration-200",
            "hover:bg-[#1e2943] text-gray-400 hover:text-white"
          )}
        >
          <Settings className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user.name}</span>
            <span className="text-xs text-gray-400">{user.email}</span>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              "hover:bg-[#1e2943] text-gray-400 hover:text-white"
            )}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
} 