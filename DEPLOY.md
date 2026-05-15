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

In the Vercel dashboard:

1. **Storage → Create Database → Postgres** (Vercel Postgres / Neon — either works).
2. Connect it to your project. Vercel auto-injects `DATABASE_URL` (and a few aliases).
3. Redeploy from the **Deployments** tab so the new env vars take effect.

If you prefer your own Postgres (Supabase / Railway / Render / RDS), set `DATABASE_URL` manually in **Settings → Environment Variables**. The format is `postgres://user:pass@host:5432/dbname?sslmode=require`.

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

Response will be JSON like `{"ok":true,"inserted":30,"total":30}`. The homepage now shows the leaderboard.

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
