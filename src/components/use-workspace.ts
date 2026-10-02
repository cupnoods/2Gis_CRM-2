"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabaseRepository, type WorkspaceData } from '@/lib/repository';

function message(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  return 'Check your connection and try again.';
}

export function useWorkspace(userId: string) {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Loading workspace…');
  const current = useRef<WorkspaceData | null>(null);
  const revision = useRef<number | null>(null);
  const queue = useRef<Promise<boolean>>(Promise.resolve(true));
  const changeNumber = useRef(0);

  useEffect(() => {
    let active = true;
    supabaseRepository.load(userId).then(snapshot => {
      if (!active) return;
      current.current = snapshot.data; revision.current = snapshot.revision;
      setData(snapshot.data); setStatus('Connected to Supabase');
    }).catch(err => { if (active) { setError(`Could not load your workspace: ${message(err)}`); setStatus('Load failed'); } });
    return () => { active = false; };
  }, [userId]);

  const save = useCallback((snapshot: WorkspaceData) => {
    const number = ++changeNumber.current;
    setStatus('Saving…');
    // Each write starts only after the previous response updated the revision.
    queue.current = queue.current.then(async () => {
      try {
        revision.current = await supabaseRepository.save(userId, snapshot, revision.current);
        if (number === changeNumber.current) { setError(''); setStatus('Saved to Supabase'); }
        return true;
      } catch (err) {
        if (number === changeNumber.current) { setError(`Changes were not saved: ${message(err)}`); setStatus('Save failed'); }
        return false;
      }
    });
  }, [userId]);

  const update = (transform: (data: WorkspaceData) => WorkspaceData) => {
    if (!current.current) return;
    const next = transform(current.current);
    current.current = next; setData(next); save(next);
  };
  const retry = () => { if (current.current) save(current.current); };
  const flush = async () => {
    let pending: Promise<boolean>;
    let saved: boolean;
    do { pending = queue.current; saved = await pending; } while (pending !== queue.current);
    return saved;
  };

  useEffect(() => {
    if (status !== 'Saving…' && status !== 'Save failed') return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [status]);

  return { data, error, status, update, retry, flush };
}
