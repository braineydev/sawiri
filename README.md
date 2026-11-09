# AZIN

AZIN is an architectural portfolio built with Next.js, TypeScript, and Supabase. The project currently contains demonstration portfolio content for development; it is not approved for public indexing or production launch.

## Local development

Requirements: Node.js 24.x and npm.

```powershell
npm.cmd ci
Copy-Item .env.local.example .env.local
npm.cmd run dev
```

Fill the local environment values as described in [`.env.local.example`](.env.local.example). Keep `AZIN_INDEXING_ENABLED=false` locally. Never commit `.env.local` or expose `SUPABASE_SECRET_KEY` in a `NEXT_PUBLIC_` variable.

## Supabase

Read [`supabase/README.md`](supabase/README.md) before configuring Supabase. Apply migrations `001` through `004` in order. The seed data is explicitly demonstration content and must not be presented as AZIN's built work.

## Owner launch checklist

Follow [`docs/OWNER-LAUNCH-CHECKLIST.md`](docs/OWNER-LAUNCH-CHECKLIST.md) for the owner-provided content, account setup, verification, and launch tasks. No Vercel preview or production deployment has been completed from this workspace.

## Quality commands

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

For SEO and indexing behavior, the production environment must have the approved HTTPS `NEXT_PUBLIC_SITE_URL` and `AZIN_INDEXING_ENABLED=true`. Keep indexing disabled until the owner approves the real content and domain. Demo projects are excluded from public queries, structured data, and the sitemap.
