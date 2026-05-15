import { NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

function classifyUrl() {
  const u =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!u) return { set: false };
  let host = "?";
  let port = "?";
  try {
    const parsed = new URL(u);
    host = parsed.hostname;
    port = parsed.port || "5432";
  } catch {
    return { set: true, parseable: false };
  }
  const isSupabasePooler = host.includes("pooler.supabase.com");
  const isSupabaseDirect = host.startsWith("db.") && host.endsWith(".supabase.co");
  return {
    set: true,
    parseable: true,
    host_kind: isSupabasePooler
      ? "supabase-pooler"
      : isSupabaseDirect
        ? "supabase-direct (IPv6-only — Vercel can't reach this on Hobby)"
        : "other",
    port,
    expected_port_for_supabase: 6543,
  };
}

export async function GET() {
  const t0 = Date.now();
  const env = classifyUrl();

  if (!hasDb || !sql) {
    return NextResponse.json(
      { ok: false, db: "not configured", env },
      { status: 500 },
    );
  }

  try {
    const r = await sql<{ now: Date }[]>`SELECT now() AS now`;
    return NextResponse.json({
      ok: true,
      db: "connected",
      now: r[0]?.now,
      latency_ms: Date.now() - t0,
      env,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        db: "connect failed",
        error: (e as Error).message,
        latency_ms: Date.now() - t0,
        env,
      },
      { status: 500 },
    );
  }
}
