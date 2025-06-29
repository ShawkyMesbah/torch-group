import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Providers } from '../../components/providers/Providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Torch Group',
  description: 'Torch Group admin dashboard',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="bg-[#111827]">
        {children}
        <Toaster position="top-right" />
      </div>
    </Providers>
  );
} 