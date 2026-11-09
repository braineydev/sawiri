create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 180),
  location text not null check (char_length(location) between 1 and 180),
  coordinates jsonb check (coordinates is null or jsonb_typeof(coordinates) = 'object'),
  year integer not null check (year between 1800 and 2200),
  area_sqm numeric(12, 2) check (area_sqm is null or area_sqm > 0),
  typology text not null check (typology in ('Residential', 'Commercial', 'Cultural', 'Interior', 'Urban')),
  status text not null check (status in ('Completed', 'In Progress', 'Concept')),
  hero_image_url text not null check (hero_image_url ~ '^https://'),
  hero_lqip text,
  gallery_json jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery_json) = 'array'),
  blueprint_urls text[] not null default '{}',
  architectural_narrative text not null default '',
  featured boolean not null default false,
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx on public.projects (display_order, year desc) where is_published = true;
create index if not exists projects_typology_idx on public.projects (typology) where is_published = true;
create index if not exists projects_featured_idx on public.projects (featured, display_order) where is_published = true;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(trim(client_name)) between 2 and 160),
  email text not null check (char_length(email) <= 254 and email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  project_typology text check (project_typology is null or project_typology in ('Residential', 'Commercial', 'Cultural', 'Interior', 'Urban')),
  estimated_area_sqm numeric(12, 2) check (estimated_area_sqm is null or estimated_area_sqm > 0),
  budget_tier text check (budget_tier is null or budget_tier in ('Under 5M', '5M–20M', '20M–50M', '50M+')),
  location text check (location is null or char_length(location) <= 180),
  message text not null check (char_length(trim(message)) between 10 and 10000),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.inquiries enable row level security;

revoke all on table public.projects from anon, authenticated;
revoke all on table public.inquiries from anon, authenticated;
grant select on table public.projects to anon, authenticated;
grant insert on table public.inquiries to anon, authenticated;

drop policy if exists "Published projects are publicly readable" on public.projects;
create policy "Published projects are publicly readable"
  on public.projects for select to anon, authenticated using (is_published = true);

drop policy if exists "Visitors may submit inquiries" on public.inquiries;
create policy "Visitors may submit inquiries"
  on public.inquiries for insert to anon, authenticated with check (true);
