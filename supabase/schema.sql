-- Apply this to an existing schedule.events table. This script never creates,
-- drops, or truncates the events table or its records.

DO $$
DECLARE
  expected_column record;
  actual_type text;
BEGIN
  IF to_regclass('schedule.events') IS NULL THEN
    RAISE EXCEPTION 'Expected existing table schedule.events; no event table was created.';
  END IF;

  FOR expected_column IN
    SELECT * FROM (VALUES
      ('id', 'text'),
      ('title', 'text'),
      ('description', 'text'),
      ('category', 'text'),
      ('start_date', 'date'),
      ('start_time', 'time'),
      ('end_date', 'date'),
      ('end_time', 'time'),
      ('location', 'text'),
      ('external_url', 'text'),
      ('created_at', 'timestamptz'),
      ('updated_at', 'timestamptz')
    ) AS expected(column_name, udt_name)
  LOOP
    SELECT column_info.udt_name
    INTO actual_type
    FROM information_schema.columns AS column_info
    WHERE column_info.table_schema = 'schedule'
      AND column_info.table_name = 'events'
      AND column_info.column_name = expected_column.column_name;

    IF actual_type IS DISTINCT FROM expected_column.udt_name THEN
      RAISE EXCEPTION 'schedule.events.%. Expected type %, found %.',
        expected_column.column_name,
        expected_column.udt_name,
        COALESCE(actual_type, 'missing column');
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_overlapping_events()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(172901, 1);

  IF EXISTS (
    SELECT 1
    FROM schedule.events AS existing
    WHERE existing.id <> NEW.id
      AND (existing.start_date + existing.start_time) < (NEW.end_date + NEW.end_time)
      AND (existing.end_date + existing.end_time) > (NEW.start_date + NEW.start_time)
  ) THEN
    RAISE EXCEPTION 'Event schedule conflicts with an existing event.'
      USING ERRCODE = '23P01';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_overlapping_events ON schedule.events;
CREATE TRIGGER prevent_overlapping_events
  BEFORE INSERT OR UPDATE OF start_date, start_time, end_date, end_time
  ON schedule.events
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_overlapping_events();

CREATE TABLE IF NOT EXISTS public.event_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Replace only category CHECK constraints so all five supported categories
-- can be stored, without touching existing event rows.
ALTER TABLE schedule.events
  DROP CONSTRAINT IF EXISTS schedule_events_category_check;

DO $$
DECLARE
  category_check record;
BEGIN
  FOR category_check IN
    SELECT constraint_info.conname
    FROM pg_constraint AS constraint_info
    WHERE constraint_info.conrelid = 'schedule.events'::regclass
      AND constraint_info.contype = 'c'
      AND pg_get_constraintdef(constraint_info.oid) ILIKE '%category%'
  LOOP
    EXECUTE format(
      'ALTER TABLE schedule.events DROP CONSTRAINT %I',
      category_check.conname
    );
  END LOOP;
END;
$$;

ALTER TABLE schedule.events
  ADD CONSTRAINT schedule_events_category_allowed
  CHECK (category IN ('STREAM', 'SCRIM', 'TOURNAMENT', 'ANNOUNCEMENT', 'COMMUNITY'))
  NOT VALID;

ALTER TABLE schedule.events
  DROP CONSTRAINT IF EXISTS schedule_events_valid_datetime_range_strict;

ALTER TABLE schedule.events
  ADD CONSTRAINT schedule_events_valid_datetime_range_strict
  CHECK ((end_date + end_time) > (start_date + start_time))
  NOT VALID;

CREATE OR REPLACE FUNCTION public.set_event_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_event_updated_at ON schedule.events;
CREATE TRIGGER set_event_updated_at
  BEFORE UPDATE ON schedule.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_event_updated_at();

CREATE OR REPLACE FUNCTION public.is_event_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.event_admins AS admins
    WHERE admins.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_event_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_event_admin() TO authenticated;

ALTER TABLE schedule.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_admins ENABLE ROW LEVEL SECURITY;

-- Remove pre-existing policies so no permissive write policy can override
-- the administrator-only policies below. This does not affect table data.
DO $$
DECLARE
  existing_policy record;
BEGIN
  FOR existing_policy IN
    SELECT policy_info.schemaname, policy_info.tablename, policy_info.policyname
    FROM pg_policies AS policy_info
    WHERE (policy_info.schemaname = 'schedule' AND policy_info.tablename = 'events')
       OR (policy_info.schemaname = 'public' AND policy_info.tablename = 'event_admins')
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  END LOOP;
END;
$$;

CREATE POLICY events_public_read
  ON schedule.events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY events_admin_insert
  ON schedule.events
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_event_admin());

CREATE POLICY events_admin_update
  ON schedule.events
  FOR UPDATE
  TO authenticated
  USING (public.is_event_admin())
  WITH CHECK (public.is_event_admin());

CREATE POLICY events_admin_delete
  ON schedule.events
  FOR DELETE
  TO authenticated
  USING (public.is_event_admin());

CREATE POLICY event_admins_self_read
  ON public.event_admins
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON schedule.events FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA schedule TO anon, authenticated;
GRANT SELECT ON schedule.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON schedule.events TO authenticated;

REVOKE ALL ON public.event_admins FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.event_admins TO authenticated;
