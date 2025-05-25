import './globals.css';
import '../styles/responsive.css'; // Import responsive styles
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HtmlAttributesProvider } from "@/components/providers/html-attributes-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { LoadingObserver } from "@/components/layout/loading-observer";
import { SessionProvider } from "@/components/providers/session-provider";
import { cn } from "@/lib/utils";
import { ClientLayout } from '@/components/layout/client-layout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Torch Group | Marketing, Media, and Talent Solutions',
  description: 'Torch Group provides innovative marketing, media, and talent solutions for forward-thinking businesses. Elevate your brand with our expert team.',
  metadataBase: new URL('https://torchgroup.co'),
  keywords: 'marketing, media, talent management, business solutions, torch group, digital marketing, creative services, talent acquisition',
  authors: [{ name: 'Torch Group Team' }],
  creator: 'Torch Group',
  publisher: 'Torch Group',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': 'https://torchgroup.co',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://torchgroup.co',
    siteName: 'Torch Group',
    title: 'Torch Group - Marketing, Media, and Talent Solutions',
    description: 'Innovative business solutions for marketing, media, and talent management. Partner with Torch Group to transform your business.',
    images: [
      {
        url: 'https://torchgroup.co/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Torch Group - Marketing, Media, and Talent Solutions'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Torch Group | Marketing, Media, and Talent Solutions',
    description: 'Innovative business solutions for marketing, media, and talent management.',
    creator: '@torchgroup',
    images: ['https://torchgroup.co/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code when available
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="extension-protection" content="no-inject-bybit-attributes" />
      </head>
      <body className={cn(
        `${inter.className} bg-black text-white relative min-h-screen overflow-x-hidden`
      )}>
        {/* Background elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Dotted grid background - darker background, more visible dots */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,40,40,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,40,40,0.15)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
          <div className="absolute inset-0 bg-black/90"></div>
          
          {/* Modified background pulsing red accents - constrained to not cause overflow */}
          <div className="absolute top-1/4 left-1/3 w-[clamp(300px,50vw,600px)] h-[clamp(300px,50vh,600px)] rounded-full bg-red-600/20 blur-[180px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[clamp(300px,50vw,600px)] h-[clamp(300px,50vh,600px)] rounded-full bg-red-600/15 blur-[200px] animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-2/3 left-1/4 w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vh,500px)] rounded-full bg-red-600/25 blur-[150px] animate-pulse-slow animation-delay-1000"></div>
        </div>
        
        <LoadingProvider initialLoadingState={true} autoHideDelay={2500}>
          <SessionProvider>
            <ClientLayout>
              <LoadingObserver />
              <HtmlAttributesProvider />
              <ToasterProvider />
              {children}
            </ClientLayout>
          </SessionProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
