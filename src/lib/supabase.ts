import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function insertNotification(type: string, message_id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from('notifications').insert([
    { type, message_id }
  ]);
} 