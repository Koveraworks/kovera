-- Kovera Database Schema & Security Policies for Supabase
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Business Registrations Table
CREATE TABLE IF NOT EXISTS public.business_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    business_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone_number TEXT,
    work_location TEXT,
    support_need TEXT,
    status TEXT DEFAULT 'new' NOT NULL
);

-- 2. Create Worker Registrations Table
CREATE TABLE IF NOT EXISTS public.worker_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    locality TEXT NOT NULL,
    experience TEXT,
    availability TEXT,
    status TEXT DEFAULT 'new' NOT NULL
);

-- Migration helpers if tables already exist
ALTER TABLE public.business_registrations ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.worker_registrations ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.business_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_registrations ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Allow anyone (anon + authenticated) to submit interest
DROP POLICY IF EXISTS "Allow public insert on business_registrations" ON public.business_registrations;
CREATE POLICY "Allow public insert on business_registrations"
ON public.business_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on worker_registrations" ON public.worker_registrations;
CREATE POLICY "Allow public insert on worker_registrations"
ON public.worker_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Note: No SELECT/UPDATE/DELETE policies are created for anon role.
-- This ensures that visitors can submit forms, but cannot read or scrape other people's submissions.
-- Only project owners/admins (via Supabase Studio or service_role key) can read and manage submissions.

-- 5. Useful indexes for querying submissions
CREATE INDEX IF NOT EXISTS idx_business_registrations_created_at ON public.business_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_worker_registrations_created_at ON public.worker_registrations (created_at DESC);
