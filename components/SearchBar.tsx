"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBar({ initial }: { initial?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initial ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    router.push(`/?${next.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 w-full max-w-2xl"
      role="search"
      aria-label="Search public figures"
    >
      <div className="flex items-center w-full border-2 border-ink bg-paper focus-within:shadow-[4px_4px_0_0_#0a0a0a] transition-shadow">
        <span className="px-3 text-ink" aria-hidden>
          🔎
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a name…"
          className="w-full bg-transparent py-3 pr-3 text-base outline-none placeholder:text-mute"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-ink text-paper font-display tracking-wide px-4 py-3 hover:bg-blood transition-colors"
        >
          GO
        </button>
      </div>
    </form>
  );
}
