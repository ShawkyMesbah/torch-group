import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import HTMLAttributesProvider from "@/components/providers/html-attributes-provider";
import ToasterProvider from "@/components/providers/toaster-provider";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import "./globals.css";
import "../styles/performance.css";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RouteLoadingProvider } from "@/components/RouteLoadingProvider";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Server-side route detection (basic):
  // You can use headers, cookies, or context to detect admin routes if needed.
  // For now, always render Header and Footer for public pages.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "text-white relative min-h-screen overflow-x-hidden")}> 
        {/* Global animated grid background */}
        <AnimatedGridBackground className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
        <HTMLAttributesProvider>
          <ToasterProvider />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <RouteLoadingProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </RouteLoadingProvider>
        </HTMLAttributesProvider>
      </body>
    </html>
  );
}
