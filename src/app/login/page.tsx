"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState('');
  const [signup, setSignup] = useState(false); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  return <main className="flex min-h-screen items-center justify-center px-4"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-6 text-xl font-semibold text-indigo-600">OshBiz CRM</div><h1 className="text-2xl font-semibold">{signup ? 'Create account' : 'Sign in'}</h1><p className="my-4 text-sm leading-6 text-slate-500">Sign in to save your CRM data securely in Supabase.</p>
    {!isSupabaseConfigured() && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Supabase is not configured for this deployment. Add the project URL and publishable key in Vercel.</p>}
    {user ? <div className="space-y-4"><p>Signed in as {user.name}</p><Link href="/catalogue" className="block text-indigo-600">Continue to workspace</Link><button onClick={signOut}>Sign out</button></div> : <form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); setMessage(''); try { if (signup) { const signedIn = await signUp(email.trim(), password, name); if (!signedIn) setMessage('Check your email to confirm your account, then sign in.'); } else await signIn(email.trim(), password); } catch (err) { setError(err instanceof Error ? err.message : 'Could not sign in.'); } finally { setBusy(false); } }} className="space-y-4">
      {signup && <label className="block text-sm font-medium">Display name<input required maxLength={80} value={name} onChange={e => setName(e.target.value)} autoComplete="name" className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3" /></label>}
      <label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3" /></label>
      <label className="block text-sm font-medium">Password<input required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} autoComplete={signup ? 'new-password' : 'current-password'} className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3" /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
      <button disabled={busy || !isSupabaseConfigured()} className="h-11 w-full rounded-lg bg-indigo-600 font-medium text-white disabled:opacity-50">{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
    </form>}
    {!user && <button className="mt-5 text-sm text-indigo-600" onClick={() => { setSignup(!signup); setError(''); setMessage(''); }}>{signup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}</button>}
  </section></main>;
}
