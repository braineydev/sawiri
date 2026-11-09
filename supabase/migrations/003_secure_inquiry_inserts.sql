-- Inquiry writes must pass through the validated API route, which applies
-- durable rate limiting and Turnstile verification before using the server key.
-- Keep inquiries private: there are no public SELECT, UPDATE, or DELETE policies.
drop policy if exists "Visitors may submit inquiries" on public.inquiries;
revoke all on table public.inquiries from anon, authenticated;
revoke all on table public.inquiries from public;
grant insert on table public.inquiries to service_role;
