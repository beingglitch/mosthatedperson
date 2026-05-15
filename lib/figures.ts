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
