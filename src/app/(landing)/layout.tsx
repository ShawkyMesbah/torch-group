import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Public Site',
  description: 'Welcome to the public landing page',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4">Public Site Header</header>
      <main className="flex-1 container mx-auto px-4">{children}</main>
      <footer className="bg-gray-100 p-4 text-center">&copy; {new Date().getFullYear()} Public Site</footer>
    </div>
  );
} 