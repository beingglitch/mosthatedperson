import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { getOrCreateVisitorId, VISITOR_COOKIE } from "@/lib/visitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

export async function POST() {
  if (!hasDb || !sql) {
    return new NextResponse(null, { status: 204 });
  }
  const { visitorId, setCookie, uuid } = await getOrCreateVisitorId();

  // Insert visitor row; idempotent — same cookie won't double-count.
  try {
    await sql`
      INSERT INTO visits (visitor_id)
      VALUES (${visitorId})
      ON CONFLICT (visitor_id) DO NOTHING
    `;
  } catch {
    // visits table may not exist before first seed — silently no-op.
  }

  const res = new NextResponse(null, { status: 204 });
  if (setCookie) {
    res.cookies.set(VISITOR_COOKIE, uuid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export const GET = POST;
