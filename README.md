# OshBiz CRM

Responsive Next.js frontend prototype for the Osh business directory and lightweight CRM.

## Run locally

```powershell
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

The project uses the App Router, TypeScript, Tailwind CSS v4, Lucide icons, TanStack Table, dnd-kit and Recharts. It intentionally uses typed local mock data; no 2GIS connection or scraping is included.

## Routes

`/catalogue`, `/companies/[id]`, `/pipeline`, `/tasks`, `/dashboard`, `/map`, `/import-export`, `/settings`.

The mock layer lives in `src/lib/mock-data.ts` and the shared domain contracts live in `src/lib/types.ts`, so Supabase queries can replace the local arrays later.

test