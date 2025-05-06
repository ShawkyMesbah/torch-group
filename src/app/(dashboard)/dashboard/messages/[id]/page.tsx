import React, { useState } from 'react';
import Link from 'next/link';
import { createSupabaseServerClient, insertNotification } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
  parent_id?: string;
}

interface PageProps {
  params: { id: string };
}

async function fetchReplies(parentId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('messages')
    .select('id, name, email, message, created_at, parent_id')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });
  return { data, error };
}

export default async function MessageDetailPage({ params }: PageProps) {
  const supabase = createSupabaseServerClient();
  const { data: message, error } = await supabase
    .from('messages')
    .select('id, name, email, phone, message, created_at')
    .eq('id', params.id)
    .single();

  const { data: initialReplies } = await fetchReplies(params.id);

  // Client-side reply form and refresh logic
  function ReplyThread({ parentId, initialReplies }: { parentId: string; initialReplies: Message[] }) {
    const [replies, setReplies] = useState<Message[]>(initialReplies || []);
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ reply: string }>();

    React.useEffect(() => {
      const supabase = createSupabaseServerClient();
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
          if (payload.new.type === 'reply') {
            toast.info('New reply notification!');
          }
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

    const onSubmit = async (data: { reply: string }) => {
      try {
        const supabase = createSupabaseServerClient();
        const { data: inserted, error } = await supabase.from('messages').insert([
          {
            name: 'Admin',
            email: 'admin@torch.com',
            message: data.reply,
            parent_id: parentId,
          },
        ]).select('id').single();
        if (error) {
          toast.error('Failed to send reply.');
        } else {
          toast.success('Reply sent!');
          reset();
          if (inserted?.id) {
            await insertNotification('reply', inserted.id);
          }
          // Refresh replies
          const { data: newReplies } = await fetchReplies(parentId);
          setReplies(newReplies || []);
        }
      } catch {
        toast.error('Failed to send reply.');
      }
    };

    return (
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Replies</h2>
        <div className="space-y-4 mb-8">
          {replies && replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{reply.name}</span>
                  <span className="text-gray-500 text-xs">{new Date(reply.created_at).toLocaleString()}</span>
                </div>
                <div className="text-gray-300 whitespace-pre-line text-sm">{reply.message}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No replies yet.</div>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 bg-gray-900 p-4 rounded-lg border border-gray-800">
          <textarea
            {...register('reply', { required: true })}
            placeholder="Write a reply..."
            rows={3}
            className="p-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="self-end bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-sm font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Reply'}
          </button>
        </form>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Toaster position="top-center" richColors />
        <Link href="/dashboard/messages" className="text-red-400 hover:underline mb-8 inline-block">&larr; Back to messages</Link>
        <div className="text-red-500 mt-8">Message not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Toaster position="top-center" richColors />
      <Link href="/dashboard/messages" className="text-red-400 hover:underline mb-8 inline-block">&larr; Back to messages</Link>
      <div className="bg-gray-900 rounded-lg p-8 max-w-xl mx-auto shadow-lg border border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Message from {message.name}</h1>
        <div className="mb-2"><span className="font-semibold">Email:</span> {message.email}</div>
        <div className="mb-2"><span className="font-semibold">Phone:</span> {message.phone || <span className="text-gray-500">N/A</span>}</div>
        <div className="mb-2"><span className="font-semibold">Received:</span> {new Date(message.created_at).toLocaleString()}</div>
        <div className="mt-6">
          <span className="font-semibold">Message:</span>
          <p className="bg-gray-800 rounded p-4 mt-2 text-gray-200 whitespace-pre-line">{message.message}</p>
        </div>
        {/* Replies and Reply Form */}
        <ReplyThread parentId={message.id} initialReplies={initialReplies || []} />
      </div>
    </div>
  );
} 