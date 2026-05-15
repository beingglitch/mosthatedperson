import { sql, hasDb } from "./db";
import { REACTION_KEYS, type ReactionKey } from "./reactions";

export type Figure = {
  id: number;
  slug: string;
  name: string;
  photo_url: string;
  description: string | null;
  category: string | null;
};

export type FigureWithCount = Figure & {
  hate_count: number;
  top_reaction: ReactionKey | null;
};

export type TimeRange = "today" | "week" | "all";

function rangeClause(range: TimeRange) {
  switch (range) {
    case "today":
      return "v.created_at > now() - interval '1 day'";
    case "week":
      return "v.created_at > now() - interval '7 days'";
    case "all":
    default:
      return "TRUE";
  }
}

function logDbError(where: string, e: unknown) {
  console.error(`[db:${where}]`, (e as Error)?.message ?? e);
}

export async function getLeaderboard(
  range: TimeRange = "all",
  search?: string,
  limit = 100,
): Promise<FigureWithCount[]> {
  if (!hasDb || !sql) return [];
  const clause = rangeClause(range);
  const q = search?.trim() ? `%${search.trim().toLowerCase()}%` : null;
  // For "today"/"week" we hide figures with no votes in the window — that's
  // what makes the filter feel real instead of showing all 30 with 0 each.
  const joinKind = range === "all" ? "LEFT" : "INNER";
  try {
    const rows = await sql.unsafe<FigureWithCount[]>(
      `
    SELECT
      f.id, f.slug, f.name, f.photo_url, f.description, f.category,
      COALESCE(s.hate_count, 0)::int AS hate_count,
      s.top_reaction
    FROM figures f
    ${joinKind} JOIN (
      SELECT
        v.figure_id,
        count(*)::int AS hate_count,
        mode() WITHIN GROUP (ORDER BY v.reaction) AS top_reaction
      FROM votes v
      WHERE ${clause}
      GROUP BY v.figure_id
    ) s ON s.figure_id = f.id
    ${q ? "WHERE lower(f.name) LIKE $1" : ""}
    ORDER BY hate_count DESC, f.name ASC
    LIMIT ${limit}
    `,
      q ? [q] : [],
    );
    return rows;
  } catch (e) {
    logDbError("getLeaderboard", e);
    return [];
  }
}

export async function getFigureBySlug(slug: string): Promise<FigureWithCount | null> {
  if (!hasDb || !sql) return null;
  try {
    const rows = await sql<FigureWithCount[]>`
      SELECT
        f.id, f.slug, f.name, f.photo_url, f.description, f.category,
        COALESCE((SELECT count(*)::int FROM votes v WHERE v.figure_id = f.id), 0) AS hate_count,
        (
          SELECT v.reaction FROM votes v WHERE v.figure_id = f.id
          GROUP BY v.reaction ORDER BY count(*) DESC LIMIT 1
        ) AS top_reaction
      FROM figures f
      WHERE f.slug = ${slug}
      LIMIT 1
    `;
    return rows[0] ?? null;
  } catch (e) {
    logDbError("getFigureBySlug", e);
    return null;
  }
}

export async function getReactionBreakdown(
  figureId: number,
): Promise<Record<ReactionKey, number>> {
  const empty = Object.fromEntries(REACTION_KEYS.map((k) => [k, 0])) as Record<
    ReactionKey,
    number
  >;
  if (!hasDb || !sql) return empty;
  try {
    const rows = await sql<{ reaction: ReactionKey; cnt: number }[]>`
      SELECT reaction, count(*)::int AS cnt
      FROM votes
      WHERE figure_id = ${figureId}
      GROUP BY reaction
    `;
    const out = { ...empty };
    for (const r of rows) out[r.reaction] = r.cnt;
    return out;
  } catch (e) {
    logDbError("getReactionBreakdown", e);
    return empty;
  }
}

export async function getVisitorVote(
  figureId: number,
  visitorId: string,
): Promise<ReactionKey | null> {
  if (!hasDb || !sql) return null;
  try {
    const rows = await sql<{ reaction: ReactionKey }[]>`
      SELECT reaction FROM votes
      WHERE figure_id = ${figureId} AND visitor_id = ${visitorId}
      LIMIT 1
    `;
    return rows[0]?.reaction ?? null;
  } catch (e) {
    logDbError("getVisitorVote", e);
    return null;
  }
}

export async function getAllSlugs(): Promise<{ slug: string; updated_at: Date }[]> {
  if (!hasDb || !sql) return [];
  try {
    const rows = await sql<{ slug: string; updated_at: Date }[]>`
      SELECT f.slug, COALESCE(max(v.created_at), f.created_at) AS updated_at
      FROM figures f LEFT JOIN votes v ON v.figure_id = f.id
      GROUP BY f.id
    `;
    return rows;
  } catch (e) {
    logDbError("getAllSlugs", e);
    return [];
  }
}

export async function getRelatedFigures(
  excludeSlug: string,
  limit = 6,
): Promise<FigureWithCount[]> {
  if (!hasDb || !sql) return [];
  try {
    const rows = await sql<FigureWithCount[]>`
      SELECT
        f.id, f.slug, f.name, f.photo_url, f.description, f.category,
        COALESCE((SELECT count(*)::int FROM votes v WHERE v.figure_id = f.id), 0) AS hate_count,
        NULL::text AS top_reaction
      FROM figures f
      WHERE f.slug <> ${excludeSlug}
      ORDER BY random()
      LIMIT ${limit}
    `;
    return rows;
  } catch (e) {
    logDbError("getRelatedFigures", e);
    return [];
  }
}

export async function getTotalHate(): Promise<number> {
  if (!hasDb || !sql) return 0;
  try {
    const rows = await sql<{ c: number }[]>`SELECT count(*)::int AS c FROM votes`;
    return rows[0]?.c ?? 0;
  } catch (e) {
    logDbError("getTotalHate", e);
    return 0;
  }
}

async function safeScalar<T = number>(
  label: string,
  run: () => Promise<{ c: T }[]>,
  fallback: T,
  timeoutMs = 3500,
): Promise<T> {
  try {
    const result = await Promise.race([
      run(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("query timeout")), timeoutMs),
      ),
    ]);
    return result[0]?.c ?? fallback;
  } catch (e) {
    logDbError(`stats:${label}`, e);
    return fallback;
  }
}

export async function getSiteStats(): Promise<{
  totalFigures: number;
  totalHate: number;
  hatedToday: number;
  totalVisitors: number;
}> {
  const empty = {
    totalFigures: 0,
    totalHate: 0,
    hatedToday: 0,
    totalVisitors: 0,
  };
  if (!hasDb || !sql) return empty;
  const s = sql;
  // Single round-trip combining all counters. to_regclass() returns NULL if a
  // table doesn't exist, so missing `visits` (pre-seed) won't error the query.
  try {
    const rows = await Promise.race([
      s<
        {
          total_figures: number;
          total_hate: number;
          hated_today: number;
          total_visitors: number;
        }[]
      >`
        SELECT
          (SELECT count(*)::int FROM figures) AS total_figures,
          (SELECT count(*)::int FROM votes)   AS total_hate,
          (SELECT count(*)::int FROM votes WHERE created_at > now() - interval '1 day') AS hated_today,
          (
            CASE WHEN to_regclass('public.visits') IS NULL
                 THEN 0
                 ELSE (SELECT count(*)::int FROM visits)
            END
          )::int AS total_visitors
      `,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("stats timeout")), 4000),
      ),
    ]);
    const r = rows[0];
    return {
      totalFigures: r?.total_figures ?? 0,
      totalHate: r?.total_hate ?? 0,
      hatedToday: r?.hated_today ?? 0,
      totalVisitors: r?.total_visitors ?? 0,
    };
  } catch (e) {
    logDbError("getSiteStats", e);
    // Fall back to per-counter probes so the page still loads with some numbers.
    return {
      totalFigures: await safeScalar(
        "figures",
        () => s<{ c: number }[]>`SELECT count(*)::int AS c FROM figures`,
        0,
      ),
      totalHate: await safeScalar(
        "votes",
        () => s<{ c: number }[]>`SELECT count(*)::int AS c FROM votes`,
        0,
      ),
      hatedToday: 0,
      totalVisitors: 0,
    };
  }
}
