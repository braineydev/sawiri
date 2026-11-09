# Supabase setup

## Configure the project

Copy `.env.local.example` to `.env.local`. Set the Supabase project URL and publishable key for public project reads. For inquiry writes, configure a server-only `SUPABASE_SECRET_KEY`; never prefix this secret with `NEXT_PUBLIC_`.

## Apply migrations

Apply `supabase/migrations/` in numeric order (`001` through `004`) in the Supabase SQL Editor, or use the CLI:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Run `seed.sql` only to load the six marked demonstration projects. Do not treat them as AZIN commissions.

## Access rules

- `projects` enables RLS. The public policy permits reads only for published rows where `is_demo = false` (migration `004`).
- `inquiries` enables RLS and has no public read, update, delete, or insert permission after migration `003`.
- `POST /api/inquiries` validates input, checks Turnstile and Upstash, then inserts using the server-only `SUPABASE_SECRET_KEY`.
- Production inquiry submissions stay disabled unless Supabase, Turnstile, and Upstash are configured.
- Do not expose private inquiry data through new public policies or endpoints.

## Storage

Project images and drawings may use public Supabase Storage object URLs. Configure bucket and object policies in Supabase before uploading. Keep only approved portfolio media in production buckets. Image hosts are restricted in `next.config.ts` to Unsplash and the configured Supabase host.

## Database types

The checked-in `src/types/database.types.ts` follows the SQL schema. Regenerate after changing database columns:

```sh
supabase gen types typescript --linked > src/types/database.types.ts
```
