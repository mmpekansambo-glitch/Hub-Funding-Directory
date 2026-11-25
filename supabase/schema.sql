-- The Hub Directory: tables for Supabase.
-- Run this once in the Supabase SQL editor, then run supabase/seed.sql.

create table if not exists public.programs (
  id integer primary key,
  program text not null,
  level text,                 -- Federal, State or Private
  state text,                 -- two-letter code, or "All", "All (rural)", etc.
  funds_what text,
  hub_stage text,             -- e.g. "Planning; Startup; Scaling"
  award_range text,
  match_requirement text,
  cycle_deadline text,
  eligibility_notes text,
  url text,
  date_verified text,
  none_found boolean not null default false  -- "None found" rows record categories checked with no program
);

create table if not exists public.states (
  state text primary key,     -- two-letter code
  status text,
  programs_found integer,
  categories_none integer,
  categories_unchecked integer,
  largest_award text,
  rank integer,               -- 1-10 for the strongest funding environments, else null
  why text
);

-- Public, read-only access for the website (anon key). Only the service role can write.
alter table public.programs enable row level security;
alter table public.states enable row level security;

drop policy if exists "Public read programs" on public.programs;
create policy "Public read programs" on public.programs for select to anon, authenticated using (true);

drop policy if exists "Public read states" on public.states;
create policy "Public read states" on public.states for select to anon, authenticated using (true);
