-- Create database schema for 2GIS CRM

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  rating_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Not yet',
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
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated read and write policies
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all access to companies" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow all access to notes" ON public.notes FOR ALL USING (true);
CREATE POLICY "Allow all access to tasks" ON public.tasks FOR ALL USING (true);
