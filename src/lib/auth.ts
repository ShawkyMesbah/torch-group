import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  // Set session cookie
  if (data.session) {
    const cookieStore = await cookies();
    cookieStore.set('sb-access-token', data.session.access_token, { httpOnly: true, path: '/' });
    cookieStore.set('sb-refresh-token', data.session.refresh_token, { httpOnly: true, path: '/' });
  }
  return data.user;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete('sb-access-token');
  cookieStore.delete('sb-refresh-token');
}

export async function getUser() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('sb-access-token')?.value;
  if (!access_token) return null;
  const { data, error } = await supabase.auth.getUser(access_token);
  if (error) return null;
  return data.user;
} 