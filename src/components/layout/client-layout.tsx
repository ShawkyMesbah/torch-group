"use client";

import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/dashboard') || pathname === '/unauthorized';
  
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      
      <main className={cn(
        "flex-grow",
        // Remove the padding to allow the content to flow naturally under the fixed header
        // The header will overlay the content rather than pushing it down
      )}>
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
} 