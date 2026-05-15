"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { formatCount } from "@/lib/format";

type Stats = {
  totalFigures: number;
  totalHate: number;
  hatedToday: number;
  totalVisitors: number;
};

const POLL_MS = 8000;

export function StatsBar(initial: Stats) {
  const [stats, setStats] = useState<Stats>(initial);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const res = await fetch("/api/stats", {
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) throw new Error("bad status");
        const next = (await res.json()) as Stats;
        if (!stopped) setStats(next);
      } catch {
        /* ignore — keep showing last good values */
      } finally {
        if (!stopped) timer = setTimeout(tick, POLL_MS);
      }
    }

    // Schedule first poll after the page settles.
    timer = setTimeout(tick, POLL_MS);

    // Refresh immediately when the tab regains focus.
    const onFocus = () => {
      if (timer) clearTimeout(timer);
      tick();
    };
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return (
    <section
      aria-label="Site stats"
      className="border-y-2 border-ink bg-ink text-paper"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x-2 divide-paper/20">
        <Cell
          label="People listed"
          value={stats.totalFigures}
          format={(n) => n.toString()}
          tone="paper"
        />
        <Cell
          label="People visited"
          value={stats.totalVisitors}
          tone="ember"
        />
        <Cell label="Total hate cast" value={stats.totalHate} tone="blood" />
        <Cell label="Hated today" value={stats.hatedToday} tone="paper" />
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  tone,
  format = formatCount,
}: {
  label: string;
  value: number;
  tone: "paper" | "blood" | "ember";
  format?: (n: number) => string;
}) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const color =
    tone === "blood"
      ? "text-blood"
      : tone === "ember"
        ? "text-ember"
        : "text-paper";

  return (
    <div className="px-4 sm:px-6 py-5 sm:py-7 flex flex-col gap-1">
      <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-paper/60 flex items-center gap-2">
        <span>{label}</span>
        <span
          aria-hidden
          className={clsx(
            "inline-block w-1.5 h-1.5 rounded-full bg-paper/30 transition-all",
            flash && "bg-blood scale-125",
          )}
        />
      </div>
      <div
        className={clsx(
          "font-display tracking-tightest leading-none tabular text-4xl sm:text-6xl transition-transform duration-300",
          color,
          flash && "scale-[1.08]",
        )}
      >
        {format(value)}
      </div>
    </div>
  );
}
