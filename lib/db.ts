import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | null | undefined;
}

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

function build() {
  if (!url) return null;
  return postgres(url, {
    ssl: "require",
    prepare: false,        // required for Supabase / pgbouncer transaction pooling
    idle_timeout: 20,
    max: 1,
    connect_timeout: 8,    // fail fast — better than hanging the page
  });
}

export const sql: ReturnType<typeof postgres> | null =
  globalThis.__sql ?? (globalThis.__sql = build());

export const hasDb = !!sql;
