import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TimeFilter } from "@/components/TimeFilter";
import { FigureCard } from "@/components/FigureCard";
import { JsonLd } from "@/components/JsonLd";
import { StatsBar } from "@/components/StatsBar";
import { getLeaderboard, getSiteStats } from "@/lib/figures";
import { hasDb } from "@/lib/db";
import { Suspense } from "react";
import { formatCount, siteUrl } from "@/lib/format";

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

  const [figures, stats] = await Promise.all([
    getLeaderboard(range, q, 60),
    getSiteStats(),
  ]);
  const total = stats.totalHate;

  const dbMissing = !hasDb;
  const empty = !dbMissing && figures.length === 0;
  const filtered = range !== "all";

  const base = siteUrl();
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Most Hated",
    alternateName: "MostHated",
    url: base,
    description:
      "The people's leaderboard of the most hated public figures in the world.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const itemListLd = figures.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Most Hated public figures",
        numberOfItems: figures.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: figures.slice(0, 20).map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${base}/p/${f.slug}`,
          name: f.name,
          image: f.photo_url,
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={websiteLd} />
      {itemListLd ? <JsonLd data={itemListLd} /> : null}
      <Header />
      <StatsBar
        totalFigures={stats.totalFigures}
        totalHate={stats.totalHate}
        hatedToday={stats.hatedToday}
        totalVisitors={stats.totalVisitors}
      />
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
            filtered ? (
              <FilteredEmptyNotice range={range} />
            ) : (
              <EmptyNotice />
            )
          ) : (
            <div className="grid gap-6 sm:gap-7 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {figures.map((f, i) => (
                <FigureCard key={f.id} figure={f} rank={i + 1} />
              ))}
            </div>
          )}
        </section>

        {/* SEO-rich body content + internal links */}
        {figures.length > 0 ? (
          <SeoFooterContent figures={figures.slice(0, 12)} />
        ) : null}
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

function SeoFooterContent({
  figures,
}: {
  figures: { slug: string; name: string }[];
}) {
  return (
    <section className="border-t-2 border-ink bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display tracking-tightest text-3xl sm:text-5xl leading-[0.95]">
            WHO IS THE MOST HATED PERSON IN THE WORLD?
          </h2>
          <div className="mt-5 space-y-4 text-base sm:text-lg leading-relaxed max-w-prose">
            <p>
              Every era has its villains — and the internet decides them in real time.
              <strong> Most Hated</strong> is a live, public leaderboard ranking the
              world's most disliked public figures across politics, tech, business,
              entertainment and sport. Each visitor casts <em>one</em> reaction per
              person — angry, clown, disgust, cringe, or overrated — and the
              leaderboard shifts as votes come in.
            </p>
            <p>
              We list <strong>only public figures with documented public criticism</strong>:
              heads of state, billionaire CEOs, household-name celebrities and influencers
              who already attract significant media scrutiny. No private individuals.
              No user-submitted names. No comments, no doxxing, no harassment.
            </p>
            <p>
              Filter by <Link href="/?range=today" className="linkish font-semibold">
              today</Link>, <Link href="/?range=week" className="linkish font-semibold">
              this week</Link>, or all-time to see which figure the internet is most
              fed up with right now. Click any photo to open that person's page and
              cast a reaction — your vote is permanent, anonymous, and counts toward
              their position on the global hate leaderboard.
            </p>
          </div>
        </div>

        <aside>
          <h3 className="font-display tracking-tightest text-xl uppercase">
            Most hated right now
          </h3>
          <ul className="mt-3 space-y-1">
            {figures.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/p/${f.slug}`}
                  className="linkish font-mono text-sm uppercase tracking-widest"
                >
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-display tracking-tightest text-xl uppercase">
            Categories
          </h3>
          <ul className="mt-3 space-y-1 text-sm font-mono uppercase tracking-widest text-mute">
            <li>Politicians & World Leaders</li>
            <li>Tech & Business CEOs</li>
            <li>Celebrities & Entertainers</li>
            <li>Influencers</li>
            <li>Athletes</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

function FilteredEmptyNotice({ range }: { range: "today" | "week" }) {
  const label = range === "today" ? "TODAY" : "THIS WEEK";
  const window = range === "today" ? "the last 24 hours" : "the last 7 days";
  return (
    <div className="border-2 border-ink p-6 sm:p-8 bg-paper">
      <div className="font-display text-3xl sm:text-4xl tracking-tightest leading-none">
        NO HATE {label}
      </div>
      <p className="mt-3 text-mute">
        Nobody has been hated in {window}. Cast the first reaction on any figure
        and it'll show up here.
      </p>
      <a
        href="/"
        className="inline-block mt-5 bg-ink text-paper font-display tracking-wide px-4 py-2 hover:bg-blood transition-colors"
      >
        ← SEE ALL TIME
      </a>
    </div>
  );
}
