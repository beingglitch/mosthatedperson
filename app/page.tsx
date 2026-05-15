import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TimeFilter } from "@/components/TimeFilter";
import { FigureCard } from "@/components/FigureCard";
import { getLeaderboard, getTotalHate } from "@/lib/figures";
import { hasDb } from "@/lib/db";
import { Suspense } from "react";
import { formatCount } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 20;

function HeroStrip({ total }: { total: number }) {
  const items = [
    "REAL PUBLIC FIGURES",
    "ONE VOTE PER PERSON",
    "NO COMMENTS, NO DOXX",
    "CURATED · GLOBAL",
    `${formatCount(total)} HATES COUNTED`,
  ];
  // duplicate to make the marquee loop seamless
  const dup = [...items, ...items, ...items];
  return (
    <div className="bg-ink text-paper overflow-hidden border-y-2 border-ink">
      <div className="flex animate-marquee whitespace-nowrap py-2 font-display tracking-widest text-sm">
        {dup.map((t, i) => (
          <span key={i} className="px-6">
            ★ {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; range?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const range = (sp.range === "today" || sp.range === "week" ? sp.range : "all") as
    | "today"
    | "week"
    | "all";

  const [figures, total] = await Promise.all([
    getLeaderboard(range, q, 60),
    getTotalHate(),
  ]);

  const dbMissing = !hasDb;
  const empty = !dbMissing && figures.length === 0;

  return (
    <>
      <Header />
      <HeroStrip total={total} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative noise border-b-2 border-ink">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            <h1 className="font-display tracking-tightest leading-[0.85] text-[clamp(48px,12vw,160px)]">
              THE MOST <span className="text-blood">HATED</span>
              <br />
              PEOPLE ON EARTH
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-mute">
              Vote with a reaction. One per person. The leaderboard updates live. We
              only list public figures with documented public criticism — no
              private individuals, no targets, no doxxing.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Suspense fallback={null}>
                <TimeFilter />
              </Suspense>
              <div className="text-xs font-mono uppercase tracking-widest text-mute">
                {q ? (
                  <>
                    Showing results for{" "}
                    <span className="text-ink">"{q}"</span>
                  </>
                ) : (
                  <>Sorted by hate · {figures.length} listed</>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {dbMissing ? (
            <DbMissingNotice />
          ) : empty ? (
            <EmptyNotice />
          ) : (
            <div className="grid gap-6 sm:gap-7 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {figures.map((f, i) => (
                <FigureCard key={f.id} figure={f} rank={i + 1} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function DbMissingNotice() {
  return (
    <div className="border-2 border-ink p-6 sm:p-8 bg-paper">
      <div className="font-display text-3xl sm:text-4xl tracking-tightest leading-none">
        NO DATABASE CONNECTED
      </div>
      <p className="mt-3 text-mute">
        Set <code className="font-mono">DATABASE_URL</code> in your environment, then
        hit{" "}
        <code className="font-mono">/api/seed?secret=YOUR_SEED_SECRET</code> once to
        create the schema and load the starter list.
      </p>
      <p className="mt-2 text-mute text-sm">
        See <code className="font-mono">DEPLOY.md</code> for the full steps.
      </p>
    </div>
  );
}

function EmptyNotice() {
  return (
    <div className="border-2 border-ink p-6 sm:p-8 bg-paper">
      <div className="font-display text-3xl sm:text-4xl tracking-tightest leading-none">
        DATABASE EMPTY
      </div>
      <p className="mt-3 text-mute">
        Visit{" "}
        <code className="font-mono">/api/seed?secret=YOUR_SEED_SECRET</code> once to
        load the starter list of public figures.
      </p>
    </div>
  );
}
