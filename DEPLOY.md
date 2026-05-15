# Deploy guide

This is a vanilla Next.js 15 app. Recommended host: **Vercel**. Tested to build clean without a database (the homepage shows a "no database" notice until one is wired up).

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Most Hated v1"
gh repo create mosthated --public --source=. --remote=origin --push
```

## 2. Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new), import the repo.
2. Framework preset: **Next.js** (auto-detected).
3. Click **Deploy** — the build will succeed even without env vars (you'll see a "no database" notice on first load).

## 3. Provision Postgres

### Option A — Supabase (recommended for free tier)

1. Go to [supabase.com](https://supabase.com) → create a project.
2. **Project → Settings → Database → Connection string → URI**.
3. Pick the **Transaction pooler** entry (port `6543`). Reveal and copy the URL.
4. In Vercel: **Settings → Environment Variables → Add** `DATABASE_URL` = that URL.

The code already sets `prepare: false` on the postgres.js client, which Supabase's pooler requires.

### Option B — Vercel Postgres / Neon

1. Vercel dashboard → **Storage → Create Database → Postgres**.
2. Connect to your project — Vercel auto-injects `DATABASE_URL`.

### Option C — anything else

Set `DATABASE_URL` manually. Format: `postgres://user:pass@host:5432/dbname?sslmode=require`.

After adding, redeploy from the **Deployments** tab so the new env vars take effect.

## 4. Add the other env vars

In **Settings → Environment Variables** add:

| Key                   | Example                                       | Notes                                  |
| --------------------- | --------------------------------------------- | -------------------------------------- |
| `SEED_SECRET`         | any random string (e.g. `openssl rand -hex 16`) | Protects the `/api/seed` endpoint     |
| `VISITOR_SALT`        | any random string                             | Salts the visitor hash. Keep stable.  |
| `NEXT_PUBLIC_SITE_URL`| `https://mosthated.example`                   | Used for canonical URLs, OG, sitemap. |

Redeploy after adding.

## 5. Seed the database (one time)

Hit this URL once:

```
https://<your-domain>/api/seed?secret=<your SEED_SECRET>
```

It creates the tables, fetches each figure's photo from Wikipedia, and loads the 30-person starter list. Response is JSON like:

```json
{ "ok": true, "inserted": 30, "wiki_hits": 28, "wiki_misses": 2, "total": 30 }
```

`wiki_misses` means a couple of Wikipedia lookups failed (network blip, redirect, etc.) — those figures get the DiceBear avatar fallback. Re-running the seed will retry them.

**To refresh existing rows** (e.g. you edited `lib/seed-data.ts` and want the changes to overwrite already-seeded figures): add `&refresh=1`:

```
https://<your-domain>/api/seed?secret=<...>&refresh=1
```

## 6. Verify

- `/` — leaderboard renders with 30 cards
- Click any photo → `/p/<slug>` — person page works
- Click a reaction → count goes up, button locks, the breakdown updates on reload
- Try a second reaction on the same person → blocked (one per visitor)
- Open `/p/<slug>/opengraph-image` → renders a 1200×630 PNG with photo + name + count
- `/sitemap.xml` lists all `/p/[slug]` URLs
- `/robots.txt` allows everything except `/api/`

## Editing the figure list

The starter list lives in `lib/seed-data.ts`. To change it:

1. Edit the array.
2. Either:
   - **Add new entries only:** re-hit `/api/seed?secret=...` (existing slugs are skipped via `ON CONFLICT DO NOTHING`).
   - **Update existing entries:** edit directly in the database (Vercel Postgres dashboard has a query editor).

To swap the placeholder avatars for real photos, replace `photo_url` with any HTTPS image URL (Wikipedia, Wikimedia Commons, your own CDN). The allowed image hosts are configured in `next.config.mjs` under `images.remotePatterns`.

## Reset all votes (admin)

There's no UI for this. Run in the Postgres console:

```sql
DELETE FROM votes;
```

## Optional: add Upstash Redis later

Not required for v1. The current DB-level rate limit handles abuse fine at small/medium scale. If you scale up and want sub-second rate limits, swap the rate-limit query in `app/api/vote/route.ts` for an Upstash Redis call.

## Cost model

- Vercel hobby: free (likely fine until ~100K monthly visits)
- Vercel Postgres: 60 free compute hours / month on Hobby
- No other paid services

If virality hits, expect to upgrade the Postgres tier first. Reads are cheap; writes are the only thing scaling with usage and they're tiny (one row per vote).
