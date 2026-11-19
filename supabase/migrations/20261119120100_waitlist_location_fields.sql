-- Waitlist: state, city, area and shop type in their own columns (issue #7)
-- ============================================================================
--
-- APPLY ORDER
--   1. supabase/migrations/20261119120000_district_list.sql
--      (creates and fills private.districts, the fixed list of districts per state)
--   2. this file
--   3. only then deploy the new frontend (the short forms).
--
-- Apply both migrations in the Supabase SQL Editor first, then deploy the new
-- frontend. The old frontend (built from main) keeps working in between: the
-- old columns stay insertable and the guards accept both the old and the new
-- shape of row. This file stops with an error, and changes nothing, if
-- private.districts is missing or empty, i.e. if step 1 was skipped.
--
-- What it does
--   * Adds nullable state, city and area to both tables, and shop_type to
--     business_registrations. Old rows keep their values and get NULLs.
--   * Makes worker_registrations.locality optional; the new form sends city
--     instead. A row through the API still needs locality or city.
--   * Re-issues the visitors' column grants: the old form columns plus the new
--     ones. Email is no longer granted, since neither form sends it.
--   * Replaces the guard triggers' functions (same names) so they accept both
--     shapes, and check that (state, city) is in private.districts and that
--     shop_type is one of the 12 ids in src/data/shopTypes.js.
--   * Recreates the team views private.business_latest / worker_latest so they
--     show the new columns.
--
-- Safe to re-run. Rows added in Supabase Studio or the SQL Editor are not
-- checked, as before (see schema.sql section 6). Rollback is at the end.

BEGIN;

-- Stop here if the district list is not in place yet.
DO $$
BEGIN
    IF to_regclass('private.districts') IS NULL THEN
        RAISE EXCEPTION 'private.districts does not exist. Apply 20261119120000_district_list.sql first.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM private.districts) THEN
        RAISE EXCEPTION 'private.districts is empty. Apply 20261119120000_district_list.sql first.';
    END IF;
END;
$$;

-- 1. Columns ------------------------------------------------------------------
ALTER TABLE public.business_registrations ADD COLUMN IF NOT EXISTS shop_type TEXT;
ALTER TABLE public.business_registrations ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.business_registrations ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.business_registrations ADD COLUMN IF NOT EXISTS area TEXT;

ALTER TABLE public.worker_registrations ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.worker_registrations ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.worker_registrations ADD COLUMN IF NOT EXISTS area TEXT;

-- 2. locality is no longer sent by the new worker form ------------------------
ALTER TABLE public.worker_registrations ALTER COLUMN locality DROP NOT NULL;

-- 3. Visitors: insert-only, form columns only ---------------------------------
-- Old form (main): business_name, contact_name, phone_number, work_location,
-- support_need / full_name, phone_number, locality, experience, availability.
-- New form: adds shop_type, state, city, area. Once the old frontend is gone
-- for good, the old-only columns can be dropped from these lists.
REVOKE ALL ON public.business_registrations FROM anon, authenticated;
GRANT INSERT (business_name, contact_name, phone_number, work_location, support_need,
              shop_type, state, city, area)
    ON public.business_registrations TO anon, authenticated;

REVOKE ALL ON public.worker_registrations FROM anon, authenticated;
GRANT INSERT (full_name, phone_number, locality, experience, availability,
              state, city, area)
    ON public.worker_registrations TO anon, authenticated;

-- 4. Checks -------------------------------------------------------------------

-- True when (state, city) is a district in the list. state is the English
-- state name and city the district name, exactly as the form sends them.
CREATE OR REPLACE FUNCTION private.intake_valid_district(state text, city text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM private.districts d
         WHERE d.state = intake_valid_district.state
           AND d.city = intake_valid_district.city);
$$;

-- The ids in src/data/shopTypes.js. Keep the two lists in step.
CREATE OR REPLACE FUNCTION private.intake_valid_shop_type(shop_type text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
    SELECT shop_type IS NOT NULL
       AND shop_type IN ('boutique', 'handloom', 'cafe', 'salon', 'kirana', 'mobile',
                         'bakery', 'hotel', 'events', 'warehouse', 'gym', 'other');
$$;

-- Both guards accept two shapes of row:
--   new form: state + city (+ area), and shop_type for businesses;
--   old form: work_location / support_need, or locality / experience /
--             availability, with no state or city.
-- Each rule is its own IF, so a NULL can never let a row slip through. The
-- length caps sit a little above the maxLength values in the forms.
-- These functions must not mention NEW.email: the live tables have no email
-- column, and plpgsql would fail on every insert.
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

    IF NOT coalesce(private.intake_valid_phone(NEW.phone_number)
        AND private.intake_text_ok(NEW.business_name, 120, true)
        AND private.intake_text_ok(NEW.contact_name, 80, true)
        AND private.intake_text_ok(NEW.work_location, 250, false)
        AND private.intake_text_ok(NEW.support_need, 1000, false)
        AND private.intake_text_ok(NEW.state, 80, false)
        AND private.intake_text_ok(NEW.city, 80, false)
        AND private.intake_text_ok(NEW.area, 120, false), false)
    THEN
        PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
    END IF;

    IF (NEW.state IS NULL) <> (NEW.city IS NULL) THEN
        PERFORM private.intake_reject(400, 'State and city go together.');
    END IF;

    IF NEW.state IS NOT NULL AND NOT private.intake_valid_district(NEW.state, NEW.city) THEN
        PERFORM private.intake_reject(400, 'That city is not in the list for that state.');
    END IF;

    IF NEW.shop_type IS NOT NULL AND NOT private.intake_valid_shop_type(NEW.shop_type) THEN
        PERFORM private.intake_reject(400, 'Unknown shop type.');
    END IF;

    IF NEW.state IS NOT NULL AND NEW.shop_type IS NULL THEN
        PERFORM private.intake_reject(400, 'A shop type is required.');
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

    IF NOT coalesce(private.intake_valid_phone(NEW.phone_number)
        AND private.intake_text_ok(NEW.full_name, 80, true)
        AND private.intake_text_ok(NEW.locality, 250, false)
        AND private.intake_text_ok(NEW.experience, 500, false)
        AND private.intake_text_ok(NEW.availability, 200, false)
        AND private.intake_text_ok(NEW.state, 80, false)
        AND private.intake_text_ok(NEW.city, 80, false)
        AND private.intake_text_ok(NEW.area, 120, false), false)
    THEN
        PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
    END IF;

    -- Old form: locality. New form: city.
    IF NEW.city IS NULL AND NOT private.intake_text_ok(NEW.locality, 250, true) THEN
        PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
    END IF;

    IF (NEW.state IS NULL) <> (NEW.city IS NULL) THEN
        PERFORM private.intake_reject(400, 'State and city go together.');
    END IF;

    IF NEW.state IS NOT NULL AND NOT private.intake_valid_district(NEW.state, NEW.city) THEN
        PERFORM private.intake_reject(400, 'That city is not in the list for that state.');
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

-- 5. Team views, rebuilt so SELECT * picks up the new columns -------------------
DROP VIEW IF EXISTS private.business_latest;
CREATE VIEW private.business_latest AS
SELECT DISTINCT ON (regexp_replace(phone_number, '[^0-9]', '', 'g'))
       count(*) OVER (PARTITION BY regexp_replace(phone_number, '[^0-9]', '', 'g')) AS responses,
       *
  FROM public.business_registrations
 WHERE phone_number IS NOT NULL
 ORDER BY regexp_replace(phone_number, '[^0-9]', '', 'g'), created_at DESC;

DROP VIEW IF EXISTS private.worker_latest;
CREATE VIEW private.worker_latest AS
SELECT DISTINCT ON (regexp_replace(phone_number, '[^0-9]', '', 'g'))
       count(*) OVER (PARTITION BY regexp_replace(phone_number, '[^0-9]', '', 'g')) AS responses,
       *
  FROM public.worker_registrations
 WHERE phone_number IS NOT NULL
 ORDER BY regexp_replace(phone_number, '[^0-9]', '', 'g'), created_at DESC;

-- Nothing in "private" is for visitors (this covers private.districts too).
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon, authenticated;

-- Tell the API about the new columns straight away (sent on COMMIT).
NOTIFY pgrst, 'reload schema';

COMMIT;

-- ============================================================================
-- Rollback
-- ============================================================================
-- Puts the grants and guards back to how they were before this file. Deploy the
-- old frontend first: the new one stops working once this runs. Select the
-- lines below, remove the leading "-- " from each, and run them.
--
-- The new columns are left in place, so rows saved with state/city/area keep
-- them; drop them by hand only if you are sure those rows can lose that data.
-- locality stays optional: "SET NOT NULL" fails once any new-form worker row
-- exists. If you need it back, first fill locality on those rows, e.g.
--   update public.worker_registrations
--      set locality = concat_ws(', ', area, city, state) where locality is null;
--
-- BEGIN;
-- REVOKE ALL ON public.business_registrations FROM anon, authenticated;
-- GRANT INSERT (business_name, contact_name, phone_number, work_location, support_need)
--     ON public.business_registrations TO anon, authenticated;
-- REVOKE ALL ON public.worker_registrations FROM anon, authenticated;
-- GRANT INSERT (full_name, phone_number, locality, experience, availability)
--     ON public.worker_registrations TO anon, authenticated;
--
-- CREATE OR REPLACE FUNCTION private.guard_business_registration()
-- RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
-- BEGIN
--     IF private.intake_is_trusted_session() THEN
--         RETURN NEW;
--     END IF;
--     IF NOT (private.intake_valid_phone(NEW.phone_number)
--         AND private.intake_text_ok(NEW.business_name, 120, true)
--         AND private.intake_text_ok(NEW.contact_name, 80, true)
--         AND private.intake_text_ok(NEW.work_location, 250, false)
--         AND private.intake_text_ok(NEW.support_need, 1000, false))
--     THEN
--         PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
--     END IF;
--     PERFORM private.intake_rate_limit();
--     RETURN NEW;
-- END;
-- $$;
--
-- CREATE OR REPLACE FUNCTION private.guard_worker_registration()
-- RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
-- BEGIN
--     IF private.intake_is_trusted_session() THEN
--         RETURN NEW;
--     END IF;
--     IF NOT (private.intake_valid_phone(NEW.phone_number)
--         AND private.intake_text_ok(NEW.full_name, 80, true)
--         AND private.intake_text_ok(NEW.locality, 250, true)
--         AND private.intake_text_ok(NEW.experience, 500, false)
--         AND private.intake_text_ok(NEW.availability, 200, false))
--     THEN
--         PERFORM private.intake_reject(400, 'A required field is missing or a field is too long.');
--     END IF;
--     PERFORM private.intake_rate_limit();
--     RETURN NEW;
-- END;
-- $$;
--
-- DROP FUNCTION IF EXISTS private.intake_valid_district(text, text);
-- DROP FUNCTION IF EXISTS private.intake_valid_shop_type(text);
-- COMMIT;
