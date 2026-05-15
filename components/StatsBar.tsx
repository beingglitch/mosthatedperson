import { formatCount } from "@/lib/format";

export function StatsBar({
  totalFigures,
  totalHate,
  hatedToday,
  totalVisitors,
}: {
  totalFigures: number;
  totalHate: number;
  hatedToday: number;
  totalVisitors: number;
}) {
  return (
    <section
      aria-label="Site stats"
      className="border-y-2 border-ink bg-ink text-paper"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x-2 divide-paper/20">
        <Cell label="People listed" value={totalFigures.toString()} tone="paper" />
        <Cell
          label="People visited"
          value={formatCount(totalVisitors)}
          tone="ember"
        />
        <Cell
          label="Total hate cast"
          value={formatCount(totalHate)}
          tone="blood"
        />
        <Cell label="Hated today" value={formatCount(hatedToday)} tone="paper" />
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "paper" | "blood" | "ember";
}) {
  const color =
    tone === "blood"
      ? "text-blood"
      : tone === "ember"
        ? "text-ember"
        : "text-paper";
  return (
    <div className="px-4 sm:px-6 py-5 sm:py-7 flex flex-col gap-1">
      <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-paper/60">
        {label}
      </div>
      <div
        className={`font-display tracking-tightest leading-none tabular ${color} text-4xl sm:text-6xl`}
      >
        {value}
      </div>
    </div>
  );
}
