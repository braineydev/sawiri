# AZIN owner launch checklist

This checklist covers the work that needs your accounts, decisions, or real studio material. The application changes for Phase 6 are in the repository; preview deployment and owner-specific account setup remain outstanding.

## 1. Approve the studio content

- [ ] Replace placeholder studio and contact copy with approved AZIN wording.
- [ ] Replace demo case studies with projects AZIN is authorized to publish. Confirm project names, locations, dates, services, descriptions, credits, and image rights.
- [ ] Upload approved project photographs, plans, and drawings to the configured public Supabase Storage bucket. Confirm image credit and permission for web/social sharing.
- [ ] Provide the official AZIN logo/wordmark and brand assets; `src/app/icon.svg` is a typographic placeholder, not a supplied brand mark.
- [ ] Add only verified awards, press, social profiles, studio address, and contact details. Do not claim items that are not true.
- [ ] Provide approved privacy and inquiry form policy text and a privacy page/link before accepting real inquiries.
- [ ] Confirm the inquiry form's recipient and operational process. Configure email delivery if the business needs notifications; the current endpoint stores submissions but is not an email service.

## 2. Configure Supabase

- [ ] Create/select the production Supabase project and keep its credentials available securely.
- [ ] Apply `supabase/migrations/001_initial_schema.sql` through `004_exclude_demo_projects.sql` in order (or link the Supabase CLI and run `supabase db push`).
- [ ] Do not run `supabase/seed.sql` in production; it inserts demo projects.
- [ ] Add approved production projects, setting `is_demo=false` and `is_published=true` only after each project is ready for public release.
- [ ] Create/configure the public Storage bucket and policies; upload only approved public portfolio assets.
- [ ] Copy the project URL and publishable key to Vercel. Add the secret key as server-only `SUPABASE_SECRET_KEY`; never use a service/secret key in browser code.
- [ ] Review Supabase RLS policies and confirm public reads expose only published non-demo projects, with inquiry records private.

## 3. Configure Vercel and domain

- [ ] Sign in to Vercel, import the repository, and set the project root to this repository.
- [ ] Set Node.js to 24.x and install/build commands to the package defaults (`npm install`/`npm run build`; use `npm ci` in CI where configured).
- [ ] Add environment variables separately to Preview and Production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` as applicable.
- [ ] Set `AZIN_INDEXING_ENABLED=false` in Preview. In Production, leave it false until the final domain and real content have been checked; then set it to `true` to enable canonical URLs, sitemap entries, and indexing metadata.
- [ ] Add the official domain in Vercel and configure its DNS as Vercel instructs. Use the final HTTPS origin, without a path, in `NEXT_PUBLIC_SITE_URL`.
- [ ] Deploy a Preview build and review it on mobile and desktop, including project filtering, project details, contact submission, images, keyboard navigation, and error states.
- [ ] Confirm CSP permits the actual configured Supabase and Turnstile hosts, and inspect browser console/network errors on the deployed preview.
- [ ] Before production deployment, confirm the public site contains no demo content and all environment variables point to production services.

## 4. Verify launch and search indexing

- [ ] Check `/`, `/projects`, `/studio`, `/contact`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/twitter-image`, and `/api/health` on the Preview deployment.
- [ ] Check a real published project detail and its social preview. Confirm unpublished and demo projects return no public case study/OG image.
- [ ] Run a production build and verify no runtime/build errors. Review the deployment logs and Vercel security headers.
- [ ] Submit the domain to Google Search Console and verify ownership (usually with a DNS TXT record).
- [ ] After production indexing is enabled, submit `https://YOUR-DOMAIN/sitemap.xml` in Search Console and inspect the home, project index, and representative project URLs.
- [ ] Check the contact workflow end-to-end and confirm inquiries reach the agreed internal process.
- [ ] Keep an owner-controlled record of Vercel, domain registrar, Supabase, Turnstile, and Upstash access/recovery methods.

## Current Phase 6 handoff status

- SEO metadata, social image routes, sitemap/robots rules, JSON-LD, demo indexing safeguards, response security headers, and error/health routes have been added.
- `npm audit` reports 0 vulnerabilities after a scoped `minimatch` override. The production-only dependency audit was also clean earlier in this phase.
- `npm ci` could not complete because Windows refused to unlink the in-use Lightning CSS native binary. That left `node_modules/.bin` incomplete, so the final typecheck, lint, and build could not be rerun. Close any local process using this workspace, then run `npm.cmd ci`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`.
- No deployment has been made. The Vercel CLI authentication check was rejected by the automatic approval review, so the repository is not linked to a Vercel project from this environment. You can complete Vercel sign-in/linking and preview review from your account.
- Lighthouse scores and deployed-browser checks are not recorded here because there is no accessible preview deployment. Run Lighthouse on the owner-reviewed Preview deployment before launch.
