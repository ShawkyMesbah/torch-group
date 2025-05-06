import React from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase';

interface Notification {
  id: string;
  type: string;
  message_id: string;
  read: boolean;
  created_at: string;
}

export default async function NotificationsPage() {
  const supabase = createSupabaseServerClient();
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('id, type, message_id, read, created_at')
    .order('created_at', { ascending: false });

  async function markAsRead(id: string) {
    'use server';
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  }

  if (error) {
    return <div className="text-red-500 p-8">Failed to load notifications.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((n: Notification) => (
            <div key={n.id} className={`bg-gray-900 rounded-lg p-6 border transition flex flex-col md:flex-row md:items-center md:justify-between ${n.read ? 'border-gray-800' : 'border-red-600'}`}>
              <div>
                <div className="font-semibold text-lg capitalize">{n.type}</div>
                <div className="text-gray-400 text-sm mb-2">{new Date(n.created_at).toLocaleString()}</div>
                <Link href={`/dashboard/messages/${n.message_id}`} className="text-blue-400 hover:underline text-sm">View Message</Link>
              </div>
              <button
                className={`mt-4 md:mt-0 px-4 py-2 rounded text-sm font-semibold transition ${n.read ? 'bg-gray-700 text-gray-400 cursor-default' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                disabled={n.read}
                formAction={async () => { await markAsRead(n.id); }}
              >
                {n.read ? 'Read' : 'Mark as Read'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No notifications found.</div>
        )}
      </div>
    </div>
  );
} 