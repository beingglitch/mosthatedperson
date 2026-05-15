"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";

const OPTIONS: { value: "today" | "week" | "all"; label: string }[] = [
  { value: "today", label: "TODAY" },
  { value: "week", label: "THIS WEEK" },
  { value: "all", label: "ALL TIME" },
];

export function TimeFilter() {
  const params = useSearchParams();
  const current = (params.get("range") as "today" | "week" | "all" | null) ?? "all";

  function hrefFor(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v === "all") next.delete("range");
    else next.set("range", v);
    const qs = next.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div
      role="tablist"
      aria-label="Time range"
      className="inline-flex items-stretch border-2 border-ink bg-paper"
    >
      {OPTIONS.map((o) => {
        const active = current === o.value;
        return (
          <Link
            key={o.value}
            href={hrefFor(o.value)}
            role="tab"
            aria-selected={active}
            className={clsx(
              "px-3 sm:px-4 py-2 font-display tracking-wide text-xs sm:text-sm border-r-2 border-ink last:border-r-0 transition-colors",
              active ? "bg-ink text-paper" : "hover:bg-ember",
            )}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}
