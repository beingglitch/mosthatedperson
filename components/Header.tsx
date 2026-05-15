import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Suspense } from "react";

export function Header() {
  return (
    <header className="border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="inline-flex items-baseline gap-2 group"
            aria-label="Most Hated — home"
          >
            <span className="font-display text-3xl sm:text-4xl leading-none tracking-tightest">
              MOST<span className="text-blood">·</span>HATED
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-mute hidden sm:inline">
              the people's leaderboard
            </span>
          </Link>
          <div className="sm:ml-auto w-full sm:max-w-md">
            <Suspense
              fallback={
                <div className="h-12 border-2 border-ink bg-paper animate-pulse" />
              }
            >
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
