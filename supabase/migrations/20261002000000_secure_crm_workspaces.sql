-- Apply to the Supabase project used by the Vercel deployment.
-- All CRM data belongs to the authenticated user. No anonymous access.
create table if not exists public.crm_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  revision bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint crm_workspaces_data_object check (jsonb_typeof(data) = 'object')
);
alter table public.crm_workspaces add column if not exists revision bigint not null default 0;
alter table public.crm_workspaces enable row level security;
revoke all on public.crm_workspaces from anon;
grant select, insert, update, delete on public.crm_workspaces to authenticated;
drop policy if exists "Owners can manage their workspace" on public.crm_workspaces;
create policy "Owners can manage their workspace" on public.crm_workspaces
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Earlier repository SQL contained FOR ALL USING (true) policies. Remove
-- those policies if that SQL was applied, so dormant legacy tables are private.
do $$
begin
  if to_regclass('public.profiles') is not null then
    execute 'drop policy if exists "Allow all access to profiles" on public.profiles';
    execute 'alter table public.profiles enable row level security';
    execute 'drop policy if exists "Profile owner" on public.profiles';
    execute 'create policy "Profile owner" on public.profiles for all to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()))';
  end if;
  if to_regclass('public.companies') is not null then
    execute 'drop policy if exists "Allow all access to companies" on public.companies';
    execute 'alter table public.companies enable row level security';
    execute 'drop policy if exists "Company owner" on public.companies';
    execute 'create policy "Company owner" on public.companies for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))';
  end if;
  if to_regclass('public.notes') is not null then
    execute 'drop policy if exists "Allow all access to notes" on public.notes';
    execute 'alter table public.notes enable row level security';
    execute 'drop policy if exists "Note owner" on public.notes';
    execute 'create policy "Note owner" on public.notes for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))';
  end if;
  if to_regclass('public.tasks') is not null then
    execute 'drop policy if exists "Allow all access to tasks" on public.tasks';
    execute 'alter table public.tasks enable row level security';
    execute 'drop policy if exists "Task owner" on public.tasks';
    execute 'create policy "Task owner" on public.tasks for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))';
  end if;
  if to_regclass('public.statuses') is not null then
    execute 'drop policy if exists "Allow all access to statuses" on public.statuses';
    execute 'alter table public.statuses enable row level security';
    execute 'drop policy if exists "Read statuses" on public.statuses';
    execute 'create policy "Read statuses" on public.statuses for select to authenticated using (true)';
  end if;
end $$;
