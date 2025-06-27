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
      <head>
        {/* Mobile Optimization Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, interactive-widget=resizes-content" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-title" content="Torch Group" />
        <meta name="application-name" content="Torch Group" />
        
        {/* Touch Icons for Mobile */}
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo.png" />
        
        {/* Performance Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* Mobile Touch & Gesture Optimization */}
        <meta name="touch-action" content="pan-x pan-y" />
      </head>
      <body className={cn(inter.className, "text-white relative min-h-screen overflow-x-hidden torch-safe-area-top torch-safe-area-bottom")}> 
        {/* Global animated grid background */}
        <AnimatedGridBackground className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
        <HTMLAttributesProvider>
          <ToasterProvider />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <RouteLoadingProvider>
            <Header />
            <main className="flex-grow torch-safe-area-left torch-safe-area-right">{children}</main>
            <Footer />
          </RouteLoadingProvider>
        </HTMLAttributesProvider>
      </body>
    </html>
  );
}
