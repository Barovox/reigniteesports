# Reignite Esports

## Run locally

1. Copy `.env.example` to `.env.local` and set your Supabase project URL and publishable key.
2. Run `npm install`.
3. Run `npm run dev`, then open the local URL printed by Vite.

The browser app uses `@supabase/supabase-js`. `@supabase/ssr` is intentionally not used because this project is a static HTML/JavaScript site, not a Next.js server-rendered app.

## Configure Supabase events and admin access

1. In Supabase Dashboard → Project Settings → API → Exposed schemas, ensure `schedule` is listed.
2. Open the Supabase SQL Editor for your project and run [`supabase/schema.sql`](./supabase/schema.sql). It preserves an existing `schedule.events` table and its records, grants the API roles access to the schema, and configures Row Level Security.
3. In Supabase Dashboard → Authentication → Users, create the administrator login account.
4. Copy that user's UUID and register it in the SQL Editor:

   ```sql
   insert into public.event_admins (user_id)
   values ('AUTH_USER_UUID');
   ```

Only users listed in `public.event_admins` can create, edit, or delete events. Public visitors can read events. Passwords are managed by Supabase Auth; there are no hard-coded admin credentials in the website.

The Supabase publishable key is used by the browser and is not a service-role secret. Keep service-role keys out of `.env.local` and all frontend code. The `.env.local` file is ignored by Git.