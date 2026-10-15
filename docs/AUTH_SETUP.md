# JSCR authentication setup

Authentication is deliberately optional. The research tools remain public and do not depend on Supabase. If the environment variables are missing, Supabase is paused, or an authentication request fails, the existing website continues operating in its original public mode.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. In Authentication > Providers > Email, enable email/password and require email confirmation.
4. Set the Site URL to `https://www.jscr.in` and add `https://www.jscr.in/auth/confirm` plus the local development URL to the redirect allow list.
5. Change the Confirm signup email link to:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
6. Configure custom SMTP. The built-in Supabase sender is not suitable for public registration.

## Vercel environment variables

Copy the names from `.env.example` into the Vercel project. `SUPABASE_SERVICE_ROLE_KEY` must remain server-only. Set `ADMIN_EMAILS` to a comma-separated list of verified administrator email addresses. Redeploy after changing variables.

## Email export

An administrator signs in, opens `/account`, and selects **Download user emails**. Authorization is checked on the server against `ADMIN_EMAILS`; the service-role key and full user list are never sent to the browser.

## Backup and pausing

The public site requires no database connection, so a paused Supabase project only disables registration, sign-in, account pages, and admin export. It does not disable calculators or other existing content.

On the free plan, periodically export the user CSV and database schema. For automated database backups, store the Supabase database connection string as a protected GitHub Actions secret named `SUPABASE_DB_URL`, then add a scheduled `pg_dump` workflow or use an external encrypted backup service. Do not commit database URLs or service keys.
