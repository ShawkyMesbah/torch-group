import { ReactNode, Suspense } from "react";
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PageLoading } from '@/components/ui/unified-loading';
import DashboardNav from '@/components/dashboard/layout/dashboard-nav';
import DashboardHeader from '@/components/dashboard/layout/dashboard-header';

// TODO: Create a /blog directory with a page.tsx for the admin blog page.

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

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
        <DashboardHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 md:pt-6">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <DashboardNav />
          </aside>
          <main className="flex w-full flex-col overflow-hidden">
            <Suspense fallback={<PageLoading />}>
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
} 