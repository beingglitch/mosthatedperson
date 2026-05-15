import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { SEED_FIGURES } from "@/lib/seed-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
`;

async function runSeed() {
  if (!sql) throw new Error("no db");

  // Run schema via unsafe (multi-statement)
  await sql.unsafe(SCHEMA_SQL);

  let inserted = 0;
  for (const f of SEED_FIGURES) {
    const r = await sql<{ id: number }[]>`
      INSERT INTO figures (slug, name, photo_url, description, category)
      VALUES (${f.slug}, ${f.name}, ${f.photo_url}, ${f.description}, ${f.category})
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `;
    if (r.length > 0) inserted++;
  }

  const total = await sql<{ c: number }[]>`SELECT count(*)::int AS c FROM figures`;
  return { inserted, total: total[0]?.c ?? 0 };
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
  try {
    const result = await runSeed();
    return NextResponse.json({ ok: true, ...result });
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
