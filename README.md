# The Hub Directory

A simple public website that helps food hub operators, especially new hubs, find grants, loans and state programs that fit their stage and state. Built from our Food Hub Funding Directory research (federal, private and state programs for all 50 states and DC, last checked 2026-11-22).

## Pages

- **Landing** (`/`): headline, search, how it works, stats and a preview of popular programs
- **Directory** (`/directory`): yellow-pages style lookup. Search plus filters for funding type, need, hub stage, state, funder and timing; results in a table (A to Z when unfiltered)
- **Program detail** (`/programs/:id`): award, match, deadlines, eligibility and source link
- **Browse** (`/browse`): tiles by stage, need, type and state
- **By state** (`/states`, `/states/:code`): every state's programs, largest award, and where nothing was found
- **About**

## Run it locally

```bash
npm install
npm run dev
```

## Data

The live site reads from the Supabase project `aloha-hub-funding-directory` (settings in `.env.production`). If Supabase can't be reached, or in local development without those settings, it falls back to the bundled `data/directory.json`.

The Google Sheet stays the place to edit programs. To refresh:

1. Export the sheet into `data/directory.json` (`scripts/sheet-to-json.py`).
2. Run `npm run seed:sql` to rebuild `supabase/seed.sql`.
3. In the Supabase SQL editor, run `supabase/seed.sql` to replace the data. (`supabase/schema.sql` has already been applied.)

The tables are public read-only (row level security), so the anon key is safe to use in the browser.

## Deploy

Vercel deploys automatically from `main`. No environment variables are needed.

## Style

Colors come from the project deck: cream background, teal, dark green `#1F5C5B`, brown `#5B3A29` and blue `#2B7A8B`, set in Manrope. No red or coral.

## Click test

`npm run test:clicks` builds the site, opens every page and clicks every link and button (nav, rows, browse options, filters, search, save). It fails if a click lands on the wrong page, leaves a blank page, or throws an error. It also runs on every pull request (GitHub Actions). Needs Playwright: `npm i --no-save playwright && npx playwright install chromium`.
