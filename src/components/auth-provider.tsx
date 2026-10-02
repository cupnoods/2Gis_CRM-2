"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { safeReturnPath } from '@/lib/auth';

type Identity = { id: string; name: string; email: string; title: string };
type AuthContext = { user: Identity | null; signIn: (email: string, password: string) => Promise<void>; signUp: (email: string, password: string, name: string) => Promise<boolean>; signOut: () => Promise<void>; updateProfile: (name: string, title: string) => Promise<void> };
const Context = createContext<AuthContext | null>(null);
export function useAuth() { const value = useContext(Context); if (!value) throw new Error('Auth provider missing'); return value; }
function identity(user: User | null): Identity | null { return user ? { id: user.id, email: user.email ?? '', name: String(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'), title: String(user.user_metadata?.role || '') } : null; }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => isSupabaseConfigured() ? createClient() : null, []);
  const [user, setUser] = useState<Identity | null>(null);
  const [ready, setReady] = useState(!client);
  const [error, setError] = useState('');
  const pathname = usePathname(); const router = useRouter();
  useEffect(() => {
    if (!client) return;
    let active = true;
    client.auth.getUser().then(({ data, error }) => { if (active) { setUser(identity(data.user)); if (error && error.name !== 'AuthSessionMissingError') setError(error.message); setReady(true); } }).catch(err => { if (active) { setError(err instanceof Error ? err.message : 'Could not check your session.'); setReady(true); } });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => { if (active) setUser(identity(session?.user ?? null)); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [client]);
  useEffect(() => { if (ready && !user && pathname !== '/login') router.replace(`/login?next=${encodeURIComponent(pathname + window.location.search)}`); }, [ready, user, pathname, router]);
  const signIn = async (email: string, password: string) => {
    if (!client) throw new Error('Supabase is not configured.');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(identity(data.user)); setError('');
    router.replace(safeReturnPath(new URLSearchParams(window.location.search).get('next')));
  };
  const signUp = async (email: string, password: string, name: string) => {
    if (!client) throw new Error('Supabase is not configured.');
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: name.trim() } } });
    if (error) throw error;
    if (data.session) { setUser(identity(data.user)); router.replace('/catalogue'); return true; }
    return false;
  };
  const signOut = async () => { if (!client) return; const { error } = await client.auth.signOut(); if (error) { setError(error.message); return; } setUser(null); router.replace('/login'); };
  const updateProfile = async (name: string, title: string) => { if (!client) throw new Error('Supabase is not configured.'); const { data, error } = await client.auth.updateUser({ data: { full_name: name.trim(), role: title.trim() } }); if (error) throw error; setUser(identity(data.user)); };
  return <Context.Provider value={{ user, signIn, signUp, signOut, updateProfile }}>{error && <p role="alert" className="bg-red-50 p-4 text-red-700">{error}</p>}{!ready || (!user && pathname !== '/login') ? <p role="status" className="p-8">Loading workspace…</p> : children}</Context.Provider>;
}
