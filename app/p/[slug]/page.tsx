import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getFigureBySlug,
  getReactionBreakdown,
  getVisitorVote,
} from "@/lib/figures";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReactionStrip } from "@/components/ReactionStrip";
import { ReactionBreakdown } from "@/components/ReactionBreakdown";
import { ShareButtons } from "@/components/ShareButtons";
import { formatCount, siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 20;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = await getFigureBySlug(slug);
  if (!f) return { title: "Not found" };
  const url = `${siteUrl()}/p/${f.slug}`;
  const title = `${f.name} — ${formatCount(f.hate_count)} hate votes`;
  const description =
    f.description ||
    `Vote and see how ${f.name} ranks on the people's hate leaderboard.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      siteName: "Most Hated",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const f = await getFigureBySlug(slug);
  if (!f) notFound();

  const { visitorId } = await getOrCreateVisitorId().catch(() => ({
    visitorId: "",
  }));
  const [breakdown, existing] = await Promise.all([
    getReactionBreakdown(f.id),
    visitorId ? getVisitorVote(f.id, visitorId) : Promise.resolve(null),
  ]);

  const url = `${siteUrl()}/p/${f.slug}`;
  const shareText = `${f.name} has ${formatCount(f.hate_count)} hate votes. Cast yours →`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: f.name,
    image: f.photo_url,
    url,
    description: f.description ?? undefined,
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-mute linkish"
          >
            ← back to leaderboard
          </Link>
        </div>

        <article className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10">
            {/* Photo */}
            <div className="relative aspect-square sm:aspect-[4/5] border-2 border-ink overflow-hidden bg-line">
              <Image
                src={f.photo_url}
                alt={f.name}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
              {f.category ? (
                <div className="absolute top-3 right-3 bg-ember text-ink text-[11px] uppercase tracking-widest font-mono px-2 py-1 border border-ink">
                  {f.category}
                </div>
              ) : null}
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <h1 className="font-display tracking-tightest leading-[0.9] text-[clamp(40px,7vw,96px)] break-words">
                {f.name.toUpperCase()}
              </h1>
              {f.description ? (
                <p className="mt-4 text-base sm:text-lg text-mute max-w-prose">
                  {f.description}
                </p>
              ) : null}

              <div className="mt-6 border-2 border-ink bg-paper p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-mute">
                  Cast your reaction — one per visitor, permanent
                </div>
                <ReactionStrip
                  figureId={f.id}
                  figureSlug={f.slug}
                  initialCount={f.hate_count}
                  initialReaction={existing}
                  size="lg"
                />
              </div>

              <div className="mt-6">
                <div className="font-display tracking-wide uppercase text-sm mb-3">
                  Reaction breakdown
                </div>
                <ReactionBreakdown breakdown={breakdown} />
              </div>

              <div className="mt-8">
                <div className="font-display tracking-wide uppercase text-sm mb-3">
                  Share
                </div>
                <ShareButtons url={url} text={shareText} />
              </div>
            </div>
          </div>
        </article>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 mb-16">
          <div className="rule" />
          <div className="mt-4 text-xs font-mono uppercase tracking-widest text-mute flex justify-between">
            <span>Public figure · documented public criticism</span>
            <Link href="/about#takedown" className="linkish">
              corrections / takedown
            </Link>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
      <Footer />
    </>
  );
}
