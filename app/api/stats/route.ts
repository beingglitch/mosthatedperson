import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/figures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 8;

export async function GET() {
  const s = await getSiteStats();
  return NextResponse.json(s, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
