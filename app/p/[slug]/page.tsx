import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getFigureBySlug,
  getReactionBreakdown,
  getVisitorVote,
  getRelatedFigures,
} from "@/lib/figures";
import { JsonLd } from "@/components/JsonLd";
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
  if (!f) return { title: "Not found", robots: { index: false, follow: false } };
  const url = `${siteUrl()}/p/${f.slug}`;
  const title = `${f.name} — ${formatCount(f.hate_count)} hate votes`;
  const description =
    `Vote and see how ${f.name} ranks on the world's most-hated leaderboard. ` +
    (f.description ?? "") +
    " One reaction per visitor.";
  return {
    title,
    description: description.trim(),
    alternates: { canonical: url },
    keywords: [
      `most hated ${f.name}`,
      `${f.name} hate`,
      `${f.name} vote`,
      `${f.name} ranking`,
      "most hated person",
      "most hated public figure",
    ],
    openGraph: {
      type: "profile",
      url,
      title,
      description: description.trim(),
      siteName: "Most Hated",
    },
    twitter: { card: "summary_large_image", title, description: description.trim() },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
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
  const [breakdown, existing, related] = await Promise.all([
    getReactionBreakdown(f.id),
    visitorId ? getVisitorVote(f.id, visitorId) : Promise.resolve(null),
    getRelatedFigures(f.slug, 6),
  ]);

  const base = siteUrl();
  const url = `${base}/p/${f.slug}`;
  const shareText = `${f.name} has ${formatCount(f.hate_count)} hate votes. Cast yours →`;

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: f.name,
    image: f.photo_url,
    url,
    description: f.description ?? undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Most Hated", item: base },
      { "@type": "ListItem", position: 2, name: f.name, item: url },
    ],
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

        {related.length > 0 ? (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
            <div className="rule" />
            <h2 className="mt-6 font-display tracking-tightest text-3xl sm:text-4xl">
              MORE HATED FIGURES
            </h2>
            <p className="mt-1 text-mute text-sm">
              Cast a reaction on someone else.
            </p>
            <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/p/${r.slug}`}
                    className="block border-2 border-ink card-hover bg-paper"
                  >
                    <div className="relative aspect-square bg-line overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.photo_url}
                        alt={r.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-2 py-2 font-display text-sm leading-[1.05] tracking-tightest">
                      {r.name.toUpperCase()}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 mb-16">
          <div className="rule" />
          <div className="mt-4 text-xs font-mono uppercase tracking-widest text-mute flex flex-col sm:flex-row gap-2 sm:justify-between">
            <span>
              Public figure · documented public criticism · {f.category ?? "unrated"}
            </span>
            <Link href="/about#takedown" className="linkish">
              corrections / takedown
            </Link>
          </div>
        </section>

        <JsonLd data={personLd} />
        <JsonLd data={breadcrumbLd} />
      </main>
      <Footer />
    </>
  );
}
