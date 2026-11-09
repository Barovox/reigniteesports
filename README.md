# Reignite Esports

## Run locally

1. Copy `.env.example` to `.env.local` and set your Supabase project URL and publishable key.
2. Run `npm install`.
3. Run `npm run dev`, then open the local URL printed by Vite.

The browser app uses `@supabase/supabase-js`. `@supabase/ssr` is intentionally not used because this project is a static HTML/JavaScript site, not a Next.js server-rendered app.

## Deploy to GitHub Pages

The site must be built with Vite before GitHub Pages serves it. The workflow at `.github/workflows/deploy-pages.yml` builds and deploys `dist` on pushes to `main`. In repository Settings → Pages, set the build and deployment source to **GitHub Actions**. The Vite base path is configured for this repository's project URL: `https://barovox.github.io/reigniteesports/`.

To enable Supabase events in the deployed site, add repository variables named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Settings → Secrets and variables → Actions → Variables. The publishable key is intended for browser use; never configure a service-role or secret key there.

## Configure Supabase events and admin access

1. In Supabase Dashboard → Project Settings → API → Exposed schemas, ensure `schedule` is listed.
2. Open the Supabase SQL Editor for your project and run [`supabase/schema.sql`](./supabase/schema.sql). The script requires the existing `schedule.events` table and checks its columns/types before proceeding; it never creates, drops, or truncates that table or its records. It applies the supported categories, schema/table grants, and Row Level Security. It replaces existing policies on `schedule.events` and `public.event_admins` so no permissive policy can grant public writes.
3. In Supabase Dashboard → Authentication → Users, create the administrator login account.
4. Copy that user's UUID and register it in the SQL Editor:

   ```sql
   insert into public.event_admins (user_id)
   values ('AUTH_USER_UUID');
   ```

Only users listed in `public.event_admins` can create, edit, or delete events. Public visitors can read events. Passwords are managed by Supabase Auth; there are no hard-coded admin credentials in the website.

The Admin Dashboard loads the event list from Supabase and supports title search, category filtering, date sorting, and INSERT/UPDATE/DELETE operations. The public calendar and event list are refreshed from the database after successful admin changes.

The Supabase publishable key is used by the browser and is not a service-role secret. Keep service-role keys out of `.env.local` and all frontend code. The `.env.local` file is ignored by Git.