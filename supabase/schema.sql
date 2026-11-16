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

-- ============================================================================
-- 6. Hardening for the public insert path
-- ============================================================================
-- The forms insert straight from the browser with the public key, so anything
-- a visitor's browser can do, a script can do too. This section limits what
-- such a script can write. It is safe to re-run.
--
--   6a. Visitors may only INSERT, and only into the columns the forms send.
--       They cannot set id, created_at or status, and cannot read, update or
--       delete anything.
--   6b. Rows arriving through the API are checked: a valid Indian mobile
--       number, required names present, a length cap on every text field.
--   6c. Rows arriving through the API are rate-limited, per IP address and in
--       total. Change the limits in private.intake_config.
--   6d. private.business_latest / private.worker_latest: the latest row per
--       phone number, for the team.
--   6e. public.keepalive(): called by .github/workflows/supabase-health.yml.
--
-- Rows added or edited in Supabase Studio or the SQL Editor are not checked or
-- limited. The checks run in an INSERT trigger rather than as table CHECK
-- constraints on purpose: a constraint would also apply whenever an existing
-- row is edited, so older rows saved without a phone number could no longer
-- have their status changed.
--
-- Run it on a scratch project first, then check with:
--   node scripts/check-waitlist-db.mjs
-- To undo it, run the rollback block at the end of this file.

-- The "private" schema is not exposed through the API.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

-- 6a. Insert-only, form columns only -----------------------------------------
-- When a form gains a column, add it to the matching GRANT below, or the form
-- will fail with a permission error.
REVOKE ALL ON public.business_registrations FROM anon, authenticated;
GRANT INSERT (business_name, contact_name, phone_number, work_location, support_need)
    ON public.business_registrations TO anon, authenticated;

REVOKE ALL ON public.worker_registrations FROM anon, authenticated;
GRANT INSERT (full_name, phone_number, locality, experience, availability)
    ON public.worker_registrations TO anon, authenticated;

-- 6c (tables). Limits, and a short-lived log of recent API inserts -------------
CREATE TABLE IF NOT EXISTS private.intake_config (
    id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
    -- Lenient on purpose: mobile carriers share IP addresses between many
    -- people, and one phone may register several workers at an outreach event.
    per_ip_per_hour INTEGER NOT NULL DEFAULT 30 CHECK (per_ip_per_hour > 0),
    -- Both forms together. Once reached, every signup fails until the hour
    -- rolls over, and the visitor is told to try again or use WhatsApp.
    total_per_hour INTEGER NOT NULL DEFAULT 300 CHECK (total_per_hour > 0)
);
INSERT INTO private.intake_config (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

-- One row per accepted API insert. Rows older than an hour are deleted as new
-- ones arrive, so IP addresses are not kept.
CREATE TABLE IF NOT EXISTS private.intake_log (
    ip INET,
    request_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_intake_log_request_at ON private.intake_log (request_at);

-- 6b / 6c (functions) ---------------------------------------------------------

-- True for Supabase Studio, the SQL Editor and the service role. The API runs
-- every visitor request as "anon" (or "authenticated"), which is not trusted.
CREATE OR REPLACE FUNCTION private.intake_is_trusted_session()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
    SELECT coalesce(nullif(current_setting('role', true), ''), 'none')
           IN ('none', 'postgres', 'service_role', 'supabase_admin');
$$;

-- Rejects the request with the given HTTP status.
CREATE OR REPLACE FUNCTION private.intake_reject(http_status integer, reason text)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    RAISE SQLSTATE 'PGRST' USING
        message = json_build_object(
            'code', 'KOVERA_INTAKE',
            'message', reason,
            'details', '',
            'hint', '')::text,
        detail = json_build_object(
            'status', http_status,
            'headers', json_build_object())::text;
END;
$$;

-- Matches isValidIndianMobile in src/lib/phone.js: ten digits starting 6 to 9,
-- whatever spacing the form saves them with.
CREATE OR REPLACE FUNCTION private.intake_valid_phone(phone text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
    SELECT phone IS NOT NULL
       AND char_length(phone) <= 20
       AND regexp_replace(phone, '[^0-9]', '', 'g') ~ '^[6-9][0-9]{9}$';
$$;

CREATE OR REPLACE FUNCTION private.intake_text_ok(value text, max_length integer, required boolean)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
    SELECT CASE
        WHEN value IS NULL THEN NOT required
        ELSE char_length(value) <= max_length AND (NOT required OR btrim(value) <> '')
    END;
$$;

-- Counts this insert against the per-IP and total limits, and rejects it with
-- 429 when either is reached. Adapted from the rate-limiting example in
-- Supabase's "Securing your API" guide.
CREATE OR REPLACE FUNCTION private.intake_rate_limit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    per_ip_limit integer := 30;
    total_limit integer := 300;
    headers jsonb;
    req_ip inet;
    recent_from_ip integer;
    recent_total integer;
BEGIN
    SELECT c.per_ip_per_hour, c.total_per_hour
      INTO per_ip_limit, total_limit
      FROM private.intake_config c
     WHERE c.id;

    -- cf-connecting-ip is set by the network edge; x-forwarded-for is the
    -- documented fallback. An address that cannot be read is counted as NULL,
    -- together with every other unreadable one.
    BEGIN
        headers := nullif(current_setting('request.headers', true), '')::jsonb;
        req_ip := btrim(coalesce(
            nullif(headers ->> 'cf-connecting-ip', ''),
            split_part(headers ->> 'x-forwarded-for', ',', 1)))::inet;
    EXCEPTION WHEN OTHERS THEN
        req_ip := NULL;
    END;

    DELETE FROM private.intake_log WHERE request_at < now() - interval '1 hour';

    SELECT count(*) FILTER (WHERE l.ip IS NOT DISTINCT FROM req_ip), count(*)
      INTO recent_from_ip, recent_total
      FROM private.intake_log l
     WHERE l.request_at >= now() - interval '1 hour';

    IF recent_from_ip >= per_ip_limit OR recent_total >= total_limit THEN
        PERFORM private.intake_reject(429, 'Too many registrations right now. Try again later.');
    END IF;

    INSERT INTO private.intake_log (ip) VALUES (req_ip);
END;
$$;

-- The length caps sit a little above the maxLength values in
-- src/sections/Waitlist.jsx, so a real visitor never reaches them.
CREATE OR REPLACE FUNCTION private.guard_business_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF private.intake_is_trusted_session() THEN
        RETURN NEW;
    END IF;

    IF NOT (private.intake_valid_phone(NEW.phone_number)
        AND private.intake_text_ok(NEW.business_name, 120, true)
        AND private.intake_text_ok(NEW.contact_name, 80, true)
        AND private.intake_text_ok(NEW.work_location, 250, false)
        AND private.intake_text_ok(NEW.support_need, 1000, false))
    THEN
        PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
    END IF;

    PERFORM private.intake_rate_limit();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION private.guard_worker_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF private.intake_is_trusted_session() THEN
        RETURN NEW;
    END IF;

    IF NOT (private.intake_valid_phone(NEW.phone_number)
        AND private.intake_text_ok(NEW.full_name, 80, true)
        AND private.intake_text_ok(NEW.locality, 250, true)
        AND private.intake_text_ok(NEW.experience, 500, false)
        AND private.intake_text_ok(NEW.availability, 200, false))
    THEN
        PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
    END IF;

    PERFORM private.intake_rate_limit();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_business_registration ON public.business_registrations;
CREATE TRIGGER guard_business_registration
BEFORE INSERT ON public.business_registrations
FOR EACH ROW EXECUTE FUNCTION private.guard_business_registration();

DROP TRIGGER IF EXISTS guard_worker_registration ON public.worker_registrations;
CREATE TRIGGER guard_worker_registration
BEFORE INSERT ON public.worker_registrations
FOR EACH ROW EXECUTE FUNCTION private.guard_worker_registration();

-- 6d. Latest row per phone number, for the team --------------------------------
-- There is deliberately no UNIQUE constraint on phone: the form lets someone
-- add another response, and a unique index would let a stranger test whether a
-- number is registered. These views live in "private" because a view in
-- "public" runs with its owner's rights and would make every row readable with
-- the public key. Rows saved without a phone number are not listed.
CREATE OR REPLACE VIEW private.business_latest AS
SELECT DISTINCT ON (regexp_replace(phone_number, '[^0-9]', '', 'g'))
       count(*) OVER (PARTITION BY regexp_replace(phone_number, '[^0-9]', '', 'g')) AS responses,
       *
  FROM public.business_registrations
 WHERE phone_number IS NOT NULL
 ORDER BY regexp_replace(phone_number, '[^0-9]', '', 'g'), created_at DESC;

CREATE OR REPLACE VIEW private.worker_latest AS
SELECT DISTINCT ON (regexp_replace(phone_number, '[^0-9]', '', 'g'))
       count(*) OVER (PARTITION BY regexp_replace(phone_number, '[^0-9]', '', 'g')) AS responses,
       *
  FROM public.worker_registrations
 WHERE phone_number IS NOT NULL
 ORDER BY regexp_replace(phone_number, '[^0-9]', '', 'g'), created_at DESC;

-- Nothing in "private" is for visitors.
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon, authenticated;

-- 6e. Health check --------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.keepalive()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
    SELECT true;
$$;
REVOKE ALL ON FUNCTION public.keepalive() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.keepalive() TO anon, authenticated;

-- ============================================================================
-- Rollback for section 6
-- ============================================================================
-- If the live form stops saving after running section 6, select the lines
-- below, remove the leading "-- " from each, and run them. This puts the
-- tables back to how sections 1 to 5 leave them. The "private" schema is left
-- in place; it does nothing once the triggers are gone.
--
-- DROP TRIGGER IF EXISTS guard_business_registration ON public.business_registrations;
-- DROP TRIGGER IF EXISTS guard_worker_registration ON public.worker_registrations;
-- GRANT ALL ON public.business_registrations TO anon, authenticated;
-- GRANT ALL ON public.worker_registrations TO anon, authenticated;
