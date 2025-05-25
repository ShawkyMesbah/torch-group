"use client";

import { ReactNode } from "react";
import DashboardNav from "@/components/layout/dashboard-nav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background elements with subtle gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,40,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,40,40,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-red-900/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-red-900/5 blur-[120px] rounded-full"></div>
      </div>
      
      {/* Main layout structure */}
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <DashboardNav />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Main content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 