-- Keep sample records available for local development while excluding them
-- from the public API, site routes, generated metadata, and the XML sitemap.
drop policy if exists "Published projects are publicly readable" on public.projects;
create policy "Published projects are publicly readable"
  on public.projects for select to anon, authenticated
  using (is_published = true and is_demo = false);
