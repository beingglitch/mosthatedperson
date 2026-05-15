"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { REACTIONS, type ReactionKey } from "@/lib/reactions";
import { formatCount } from "@/lib/format";

const LS_PREFIX = "mh_vote_";

function readLocal(slug: string): ReactionKey | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LS_PREFIX + slug);
    return (v as ReactionKey) || null;
  } catch {
    return null;
  }
}

function writeLocal(slug: string, key: ReactionKey) {
  try {
    window.localStorage.setItem(LS_PREFIX + slug, key);
  } catch {
    /* noop */
  }
}

export function ReactionStrip({
  figureId,
  figureSlug,
  initialCount,
  initialReaction = null,
  compact = false,
  size = "md",
  onVoted,
}: {
  figureId: number;
  figureSlug: string;
  initialCount: number;
  initialReaction?: ReactionKey | null;
  compact?: boolean;
  size?: "md" | "lg";
  onVoted?: (reaction: ReactionKey) => void;
}) {
  const [count, setCount] = useState(initialCount);
  const [chosen, setChosen] = useState<ReactionKey | null>(initialReaction);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chosen) {
      const fromLocal = readLocal(figureSlug);
      if (fromLocal) setChosen(fromLocal);
    }
  }, [chosen, figureSlug]);

  async function react(key: ReactionKey) {
    if (busy || chosen) return;
    setBusy(true);
    setError(null);
    setChosen(key);
    setCount((c) => c + 1);
    setShake(true);
    setTimeout(() => setShake(false), 400);
    writeLocal(figureSlug, key);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ figureId, reaction: key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.already && data?.reaction) {
          setChosen(data.reaction);
          writeLocal(figureSlug, data.reaction);
          // server-side count is authoritative; refresh from response if returned
          if (typeof data.count === "number") setCount(data.count);
          setError(null);
        } else {
          setError(data?.error || "Couldn't record vote.");
          setCount((c) => c - 1);
          setChosen(initialReaction);
        }
        setBusy(false);
        return;
      }
      if (typeof data.count === "number") setCount(data.count);
      onVoted?.(key);
    } catch {
      setError("Network error.");
      setCount((c) => c - 1);
      setChosen(initialReaction);
    } finally {
      setBusy(false);
    }
  }

  const btnSize =
    size === "lg"
      ? "text-3xl sm:text-4xl w-14 sm:w-16 h-14 sm:h-16"
      : "text-xl w-10 h-10";

  return (
    <div className={clsx("mt-3", compact ? "" : "mt-5")}>
      <div className="flex items-center gap-2 flex-wrap">
        {REACTIONS.map((r) => {
          const isChosen = chosen === r.key;
          const disabled = !!chosen || busy;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => react(r.key)}
              disabled={disabled}
              aria-pressed={isChosen}
              aria-label={`React ${r.label}`}
              title={r.label}
              className={clsx(
                "reset-btn flex items-center justify-center border-2 border-ink leading-none select-none",
                btnSize,
                isChosen
                  ? "bg-blood text-paper"
                  : disabled
                    ? "bg-paper opacity-50 cursor-not-allowed"
                    : "bg-paper hover:bg-ember hover:-translate-y-0.5 transition-transform",
                shake && isChosen && "animate-shake-up",
              )}
            >
              <span aria-hidden>{r.emoji}</span>
            </button>
          );
        })}
        <div
          className={clsx(
            "ml-auto font-display tracking-tightest tabular leading-none",
            size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl",
          )}
          aria-live="polite"
        >
          {formatCount(count)}
          <span className="ml-1 text-xs font-mono uppercase tracking-widest text-mute align-top">
            hate
          </span>
        </div>
      </div>
      {chosen ? (
        <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-mute">
          You already reacted. One per visitor.
        </div>
      ) : null}
      {error ? (
        <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-blood">
          {error}
        </div>
      ) : null}
    </div>
  );
}
