alter table public.projects
  add column if not exists comparison_pairs jsonb not null default '[]'::jsonb
  check (jsonb_typeof(comparison_pairs) = 'array');
