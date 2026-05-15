import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { SEED_FIGURES } from "@/lib/seed-data";
import { fetchWikipediaImage } from "@/lib/wikipedia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS figures (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  photo_url   TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS votes (
  id          BIGSERIAL PRIMARY KEY,
  figure_id   INT NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
  reaction    TEXT NOT NULL CHECK (reaction IN ('angry','clown','disgust','cringe','overrated')),
  visitor_id  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (figure_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_figure   ON votes(figure_id);
CREATE INDEX IF NOT EXISTS idx_votes_created  ON votes(created_at);
CREATE INDEX IF NOT EXISTS idx_votes_visitor  ON votes(visitor_id);

CREATE TABLE IF NOT EXISTS visits (
  visitor_id  TEXT PRIMARY KEY,
  first_seen  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visits_first   ON visits(first_seen);
`;

async function runSeed(refresh: boolean) {
  if (!sql) throw new Error("no db");

  await sql.unsafe(SCHEMA_SQL);

  let inserted = 0;
  let updated = 0;
  let wikiHits = 0;
  let wikiMisses = 0;

  // Fetch all Wikipedia images in parallel batches of 6, so 30 figures
  // resolve in ~5 round-trips instead of serially (~30 round-trips).
  const photos = new Map<string, string>();
  const batchSize = 6;
  for (let i = 0; i < SEED_FIGURES.length; i += batchSize) {
    const batch = SEED_FIGURES.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((f) =>
        fetchWikipediaImage(f.wiki).then((r) => ({ slug: f.slug, image: r?.image })),
      ),
    );
    for (const r of results) {
      if (r.image) {
        photos.set(r.slug, r.image);
        wikiHits++;
      } else {
        wikiMisses++;
      }
    }
  }

  for (const f of SEED_FIGURES) {
    const photo = photos.get(f.slug) ?? f.photo_url;

    if (refresh) {
      const r = await sql<{ id: number; was_insert: boolean }[]>`
        INSERT INTO figures (slug, name, photo_url, description, category)
        VALUES (${f.slug}, ${f.name}, ${photo}, ${f.description}, ${f.category})
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          photo_url = EXCLUDED.photo_url,
          description = EXCLUDED.description,
          category = EXCLUDED.category
        RETURNING id, (xmax = 0) AS was_insert
      `;
      if (r[0]?.was_insert) inserted++;
      else updated++;
    } else {
      const r = await sql<{ id: number }[]>`
        INSERT INTO figures (slug, name, photo_url, description, category)
        VALUES (${f.slug}, ${f.name}, ${photo}, ${f.description}, ${f.category})
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `;
      if (r.length > 0) inserted++;
    }
  }

  const total = await sql<{ c: number }[]>`SELECT count(*)::int AS c FROM figures`;
  return {
    inserted,
    updated,
    wiki_hits: wikiHits,
    wiki_misses: wikiMisses,
    total: total[0]?.c ?? 0,
  };
}

function authorized(req: Request) {
  const secret = process.env.SEED_SECRET;
  if (!secret) return false;
  const url = new URL(req.url);
  const provided =
    url.searchParams.get("secret") ||
    req.headers.get("x-seed-secret") ||
    "";
  return provided === secret;
}

export async function GET(req: Request) {
  if (!hasDb) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const refresh = url.searchParams.get("refresh") === "1";
  try {
    const result = await runSeed(refresh);
    return NextResponse.json({ ok: true, refresh, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: "seed failed", detail: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
