import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { getOrCreateVisitorId, VISITOR_COOKIE } from "@/lib/visitor";
import { isReactionKey } from "@/lib/reactions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb || !sql) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  let body: { figureId?: unknown; reaction?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const figureId = Number(body.figureId);
  const reaction = body.reaction;

  if (!Number.isInteger(figureId) || figureId <= 0) {
    return NextResponse.json({ error: "Invalid figureId" }, { status: 400 });
  }
  if (!isReactionKey(reaction)) {
    return NextResponse.json({ error: "Invalid reaction" }, { status: 400 });
  }

  const { visitorId, setCookie, uuid } = await getOrCreateVisitorId();

  // Lightweight DB-level rate limit: max 12 votes / minute / visitor
  const recent = await sql<{ c: number }[]>`
    SELECT count(*)::int AS c FROM votes
    WHERE visitor_id = ${visitorId}
      AND created_at > now() - interval '60 seconds'
  `;
  if ((recent[0]?.c ?? 0) >= 12) {
    return NextResponse.json(
      { error: "Slow down — too many votes from this device." },
      { status: 429 },
    );
  }

  // Insert; UNIQUE(figure_id, visitor_id) prevents double-voting.
  const inserted = await sql<{ id: number }[]>`
    INSERT INTO votes (figure_id, reaction, visitor_id)
    VALUES (${figureId}, ${reaction}, ${visitorId})
    ON CONFLICT (figure_id, visitor_id) DO NOTHING
    RETURNING id
  `;

  // Get current total for this figure
  const totals = await sql<{ c: number; r?: string }[]>`
    SELECT count(*)::int AS c FROM votes WHERE figure_id = ${figureId}
  `;
  const count = totals[0]?.c ?? 0;

  // If insert produced nothing, the visitor already voted — fetch what they picked
  let already = false;
  let chosenReaction: string = reaction;
  if (inserted.length === 0) {
    already = true;
    const existing = await sql<{ reaction: string }[]>`
      SELECT reaction FROM votes
      WHERE figure_id = ${figureId} AND visitor_id = ${visitorId}
      LIMIT 1
    `;
    if (existing[0]) chosenReaction = existing[0].reaction;
  }

  const res = NextResponse.json(
    {
      ok: !already,
      already,
      reaction: chosenReaction,
      count,
    },
    { status: already ? 409 : 200 },
  );

  if (setCookie) {
    res.cookies.set(VISITOR_COOKIE, uuid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      secure: process.env.NODE_ENV === "production",
    });
  }

  return res;
}
