"use client";
import { useState } from 'react';
import { useAuth } from './auth-provider';
import { Button, SectionCard } from './ui';

export function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [title, setTitle] = useState(user?.title ?? '');
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [saved, setSaved] = useState(false);
  return <SectionCard title="Profile"><form className="space-y-4 p-5" onChange={() => setSaved(false)} onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError('');
    try { await updateProfile(name, title); setSaved(true); } catch (err) { setError(err instanceof Error ? err.message : 'Could not save your profile.'); } finally { setBusy(false); }
  }}><label className="block">Full name<input required maxLength={80} value={name} onChange={event => setName(event.target.value)} className="form-input" /></label><label className="block">Job title<input maxLength={80} value={title} onChange={event => setTitle(event.target.value)} className="form-input" /></label><p className="text-sm text-slate-500">Signed in as {user?.email}</p><Button type="submit" disabled={busy || !name.trim()}>{busy ? 'Saving profile…' : 'Save profile'}</Button>{saved && <p role="status" className="text-emerald-700">Profile saved.</p>}{error && <p role="alert" className="text-red-700">{error}</p>}</form></SectionCard>;
}
