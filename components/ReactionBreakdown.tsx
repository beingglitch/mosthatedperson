import { REACTIONS, type ReactionKey } from "@/lib/reactions";
import { formatCount } from "@/lib/format";

export function ReactionBreakdown({
  breakdown,
}: {
  breakdown: Record<ReactionKey, number>;
}) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return (
      <div className="text-mute text-sm font-mono uppercase tracking-widest">
        No reactions yet — be the first.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {REACTIONS.map((r) => {
        const n = breakdown[r.key] ?? 0;
        const pct = total > 0 ? Math.round((n / total) * 100) : 0;
        return (
          <div key={r.key} className="flex items-center gap-3">
            <div className="w-16 sm:w-20 shrink-0 flex items-center gap-1 text-sm">
              <span aria-hidden>{r.emoji}</span>
              <span className="font-mono uppercase tracking-widest text-[10px] text-mute">
                {r.label}
              </span>
            </div>
            <div className="flex-1 h-3 border-2 border-ink bg-paper relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-blood"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
            <div className="w-20 text-right tabular text-sm">
              <span className="font-display">{formatCount(n)}</span>{" "}
              <span className="text-mute text-xs">({pct}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
