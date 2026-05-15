# Most Hated

A people's leaderboard for the world's most hated public figures. Pick a reaction. Each reaction is +1 hate. The list is curated — users can't add names.

## Stack

- **Next.js 15** (App Router, RSC) + **React 19**
- **Tailwind 3** for styling, **Anton + Inter** via `next/font`
- **postgres.js** for Postgres (works with Vercel Postgres / Neon / any Postgres URL)
- **next/og** for auto-generated share images
- No Redis required — DB-level rate limit + cookie/IP-hash visitor identity

## Features

- Curated leaderboard of public figures with hate counts
- Time filter: Today / This Week / All-Time
- Search bar
- Per-person page at `/p/[slug]` with reaction breakdown + share buttons
- Auto-generated OG image per person (face + name + hate count)
- One reaction per visitor per person, permanent (enforced both client + server)
- Rate-limited at the DB (12 votes / minute / visitor)
- Sitemap, robots, JSON-LD, OG meta — all wired up

## Quick start

```bash
npm install
cp .env.example .env.local      # fill in DATABASE_URL + SEED_SECRET + VISITOR_SALT
npm run dev
```

Then hit `http://localhost:3000/api/seed?secret=YOUR_SEED_SECRET` once to create
the schema and load the starter list.

## Deploy

See `DEPLOY.md`.
