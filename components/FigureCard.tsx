import Link from "next/link";
import Image from "next/image";
import type { FigureWithCount } from "@/lib/figures";
import { reactionMeta } from "@/lib/reactions";
import { formatCount } from "@/lib/format";
import { ReactionStrip } from "./ReactionStrip";

export function FigureCard({
  figure,
  rank,
}: {
  figure: FigureWithCount;
  rank: number;
}) {
  const top = figure.top_reaction ? reactionMeta(figure.top_reaction) : null;

  return (
    <article className="relative card-hover border-2 border-ink bg-paper">
      {/* Rank ribbon */}
      <div className="absolute -top-3 -left-3 z-10 bg-ink text-paper px-2 py-1 font-display text-xl tabular leading-none border-2 border-ink">
        #{rank}
      </div>

      <Link
        href={`/p/${figure.slug}`}
        className="block relative aspect-[4/5] overflow-hidden bg-line group/photo"
        aria-label={`Open ${figure.name}`}
      >
        <Image
          src={figure.photo_url}
          alt={figure.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover/photo:scale-[1.04]"
          unoptimized
        />
        {/* Hover intro */}
        {figure.description ? (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/photo:translate-y-0 transition-transform duration-300 bg-ink/90 text-paper text-xs sm:text-sm p-3 leading-snug">
            {figure.description}
          </div>
        ) : null}
        {/* Category tag */}
        {figure.category ? (
          <div className="absolute top-2 right-2 bg-ember text-ink text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 border border-ink">
            {figure.category}
          </div>
        ) : null}
      </Link>

      <div className="p-3 sm:p-4 border-t-2 border-ink">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/p/${figure.slug}`}
              className="block font-display text-2xl sm:text-3xl leading-[0.95] tracking-tightest truncate hover:text-blood"
            >
              {figure.name.toUpperCase()}
            </Link>
            <div className="mt-1 text-xs font-mono uppercase tracking-widest text-mute">
              {formatCount(figure.hate_count)} hate
              {top ? (
                <>
                  {" · mostly "}
                  <span aria-hidden>{top.emoji}</span>{" "}
                  <span>{top.label.toLowerCase()}</span>
                </>
              ) : null}
            </div>
          </div>
          <Link
            href={`/p/${figure.slug}`}
            className="shrink-0 bg-blood text-paper font-display tracking-wide px-3 py-2 hover:bg-ink transition-colors"
          >
            HATE →
          </Link>
        </div>

        <ReactionStrip
          figureId={figure.id}
          figureSlug={figure.slug}
          compact
          initialCount={figure.hate_count}
        />
      </div>
    </article>
  );
}
