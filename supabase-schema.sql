-- Create database schema for 2GIS CRM

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'Sales Manager',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status subtable for options lookup & reference
CREATE TABLE IF NOT EXISTS public.statuses (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO public.statuses (id, label, description, sort_order)
VALUES
  ('Not yet', 'Not yet', 'Initial uncontacted status', 1),
  ('In progress', 'In progress', 'Currently in active communication', 2),
  ('Worked with', 'Worked with', 'Existing client or closed lead', 3),
  ('Declined', 'Declined', 'Not interested or rejected proposal', 4)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  rating_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Not yet' REFERENCES public.statuses(id) ON UPDATE CASCADE,
  priority TEXT DEFAULT 'B',
  tags TEXT[] DEFAULT '{}',
  assignee TEXT,
  favourite BOOLEAN DEFAULT FALSE,
  wishlist BOOLEAN DEFAULT FALSE,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  website TEXT,
  next_action TEXT,
  next_action_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  due TEXT NOT NULL,
  bucket TEXT NOT NULL,
  assignee TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present before recreating
DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all access to statuses" ON public.statuses;
DROP POLICY IF EXISTS "Allow all access to companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all access to notes" ON public.notes;
DROP POLICY IF EXISTS "Allow all access to tasks" ON public.tasks;

-- Create public/authenticated read and write policies
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all access to statuses" ON public.statuses FOR ALL USING (true);
CREATE POLICY "Allow all access to companies" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow all access to notes" ON public.notes FOR ALL USING (true);
CREATE POLICY "Allow all access to tasks" ON public.tasks FOR ALL USING (true);
