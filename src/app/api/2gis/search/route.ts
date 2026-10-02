import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

type Place = { id?: string; name?: string; type?: string; address_name?: string; point?: { lon?: number; lat?: number }; rubrics?: Array<{ name?: string }> };
export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const placesKey = process.env.GIS_PLACES_API_KEY;
  if (!url || !publishableKey || !placesKey) return NextResponse.json({ error: '2GIS Places search is not configured.' }, { status: 503 });
  const token = request.headers.get('authorization')?.replace(/^Bearer /i, '');
  if (!token) return NextResponse.json({ error: 'Sign in to search businesses.' }, { status: 401 });
  const { data: { user }, error } = await createClient(url, publishableKey).auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Your session has expired. Sign in again.' }, { status: 401 });
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (query.length < 2 || query.length > 100) return NextResponse.json({ error: 'Search must be 2–100 characters.' }, { status: 400 });
  const upstream = new URL('https://catalog.api.2gis.com/3.0/items');
  upstream.searchParams.set('q', query);
  upstream.searchParams.set('point', '72.8161,40.514');
  upstream.searchParams.set('radius', '15000');
  upstream.searchParams.set('type', 'branch');
  upstream.searchParams.set('page_size', '10');
  upstream.searchParams.set('fields', 'items.point,items.rubrics');
  upstream.searchParams.set('key', placesKey);
  try {
    const response = await fetch(upstream, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    const payload = await response.json();
    if (!response.ok || payload?.meta?.code !== 200) return NextResponse.json({ error: '2GIS search failed. Check the Places API key and subscription.' }, { status: 502 });
    const items: Place[] = Array.isArray(payload?.result?.items) ? payload.result.items : [];
    const places = items.filter(item => item.type === 'branch' && item.id && item.name).map(item => ({
      id: `2gis-${item.id}`, source: '2gis' as const, sourceId: item.id!, name: item.name!, category: item.rubrics?.[0]?.name || 'Business',
      address: item.address_name || 'Address unavailable', district: 'Osh area',
      ...(Number.isFinite(item.point?.lon) && Number.isFinite(item.point?.lat) ? { longitude: item.point!.lon, latitude: item.point!.lat } : {}),
    }));
    return NextResponse.json({ places }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: '2GIS search is temporarily unavailable.' }, { status: 502 }); }
}
