# Aloha · Food Hub Funding Directory

A simple public website that helps food hub operators, especially new hubs, find grants, loans and state programs that fit their stage and state. Built from Aloha's Food Hub Funding Directory research (federal, private and state programs for all 50 states and DC, last checked 2026-11-22).

## Pages

- **Home**: search, "start with your stage", and the ten strongest state funding environments
- **Programs** (`/programs`): search and filter by hub stage, state, type (federal, state, private) and timing
- **Program detail** (`/programs/:id`): award, match, deadlines, eligibility and source link
- **By state** (`/states`, `/states/:code`): every state's programs, largest award, and where nothing was found
- **About**

## Run it locally

```bash
npm install
npm run dev
```

## Data

The site reads from Supabase when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (see `.env.example`). Without them it uses the bundled `data/directory.json`, so it works with no setup.

The Google Sheet stays the place to edit programs. To refresh:

1. Export the sheet into `data/directory.json` (`scripts/sheet-to-json.py`).
2. Run `npm run seed:sql` to rebuild `supabase/seed.sql`.
3. In Supabase, run `supabase/schema.sql` once, then `supabase/seed.sql` whenever the data changes.

The tables are public read-only (row level security), so the anon key is safe to use in the browser.

## Deploy

Import this repo in Vercel (framework: Vite). Add the two Supabase variables in the Vercel project settings once the Supabase project exists.

## Style

Colors come from the Aloha Playbook deck: cream background, teal, dark green `#1F5C5B`, brown `#5B3A29` and a hibiscus coral accent, set in Manrope.
