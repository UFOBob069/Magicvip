import { cn } from "@/lib/utils";

export function CompatibilityMeter({ score }: { score: number }) {
  const tone =
    score >= 85
      ? "bg-emerald-500"
      : score >= 70
        ? "bg-sky-500"
        : score >= 50
          ? "bg-amber-500"
          : "bg-slate-400";
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 w-28 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", tone)}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className="font-display text-sm font-semibold tabular-nums">
        {score}
      </span>
    </div>
  );
}
