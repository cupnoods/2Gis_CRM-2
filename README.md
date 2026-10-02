# OshBiz CRM

Next.js CRM for businesses in Osh. Accounts use Supabase Auth and CRM records are saved to a per-user Supabase row with Row Level Security. The catalogue starts empty for a new account; sample businesses are no longer presented as real data.

## Required deployment setup

The migration below was applied to Supabase project `ckvxkwriwgvxeybngful` on 2026-10-02. Transactional database checks passed for owner create/read/update, cross-user isolation, anonymous denial and stale-revision protection; test records were rolled back. The Vercel deployment still needs the updated code and matching environment variables.

1. In the **same Supabase project used by Vercel**, run [`supabase/migrations/20261002000000_secure_crm_workspaces.sql`](supabase/migrations/20261002000000_secure_crm_workspaces.sql). It creates `crm_workspaces` and removes the unsafe public policies from the previous schema if those tables exist. Do not run the old `supabase-schema.sql` from earlier commits.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel for the deployment environment. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` name also works. Use a publishable/anon key, never a service-role key in `NEXT_PUBLIC_*`.
3. Enable email/password sign-in in Supabase Auth. If email confirmation is enabled, configure the live site URL and allowed redirect URLs in Supabase. New users must confirm their email before signing in.
4. Set `NEXT_PUBLIC_2GIS_API_KEY` for MapGL tiles. For business search, obtain a **Places API** key with a subscription that permits your use and set `GIS_PLACES_API_KEY` as a server-side Vercel variable. A MapGL key alone does not establish Places API access. Only import/store 2GIS records if your agreement permits retention.
5. Redeploy after changing Vercel variables. Sign in, create a company, wait for **Saved to Supabase**, reload, then check the record from another browser or device with the same account.

Previous browser-only records are not silently uploaded. On **Import / Export**, use **Import browser data** to copy earlier `oshbiz_companies`, `oshbiz_tasks`, or `oshbiz.workspace.v1` records into the authenticated workspace. The browser backup remains intact. CSV import/export and JSON download remain available.

## Local development

```powershell
npm ci
npm run dev
```

Use a `.env.local` file for the public Supabase URL/key and optional 2GIS keys. Do not commit it. Without Supabase variables, the app shows a configuration error instead of accepting a fake login or pretending to save.

The 2GIS search imports names, categories, addresses and coordinates within 15 km of Osh. Phone/contact access requires additional permissions from 2GIS and is not requested by this integration. See the [Places API documentation](https://docs.2gis.com/en/api/search/places/overview).

```powershell
npm run typecheck
npm run lint
npm run build
npm test
```

Browser tests use a simulated Supabase HTTP service and Microsoft Edge. They verify login failures, database save requests, reloads, save retries, conflicts, browser-data recovery and creation buttons. Live database permissions were verified separately as described above. The Vercel owner must deploy the updated code and verify a real save from two browsers. Live 2GIS search remains unverified until a Places API key is configured.

Data is stored as one JSON workspace per authenticated user inside Supabase `crm_workspaces`. Saves are serialized within a tab and use a database revision to prevent a stale tab from overwriting newer changes. On a conflict or save failure, keep the page open, retry a connection failure, or download unsaved records before reloading. Sign-out waits for successful saves. Multi-user shared workspaces are not implemented; each account has its own records.
