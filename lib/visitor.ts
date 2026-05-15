import { cookies, headers } from "next/headers";
import { createHash, randomUUID } from "node:crypto";

const COOKIE_NAME = "mh_vid";
const SALT = process.env.VISITOR_SALT || "fallback-salt-change-in-prod";

export async function getOrCreateVisitorId(): Promise<{
  visitorId: string;
  setCookie: boolean;
  uuid: string;
}> {
  const jar = await cookies();
  let uuid = jar.get(COOKIE_NAME)?.value;
  let setCookie = false;
  if (!uuid || uuid.length < 16) {
    uuid = randomUUID();
    setCookie = true;
  }
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "0.0.0.0";
  const visitorId = createHash("sha256").update(`${uuid}|${ip}|${SALT}`).digest("hex");
  return { visitorId, setCookie, uuid };
}

export const VISITOR_COOKIE = COOKIE_NAME;
