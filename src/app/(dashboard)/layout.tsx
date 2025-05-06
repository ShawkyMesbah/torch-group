import React, { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'User dashboard',
};

function UnreadNotificationsBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createSupabaseServerClient();
    let ignore = false;
    async function fetchUnread() {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('read', false);
      if (!ignore && data) setCount(data.length);
    }
    fetchUnread();
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchUnread)
      .subscribe();
    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  if (count === 0) return null;
  return (
    <Link href="/dashboard/notifications" className="relative ml-4">
      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full absolute -top-2 -right-2">{count}</span>
      <span className="text-gray-700">Notifications</span>
    </Link>
  );
}

function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  return (
    <button
      onClick={handleSignOut}
      className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
    >
      Sign Out
    </button>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 mb-6 flex items-center justify-between">
        <span>Dashboard Navigation</span>
        <div className="flex items-center">
          <UnreadNotificationsBadge />
          <SignOutButton />
        </div>
      </nav>
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
} 