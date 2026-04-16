import Link from "next/link";
import { cn } from "@/lib/utils";
import { eachDateInclusive } from "@/lib/utils";
import type { TripWithGroup } from "@/lib/types";

interface Props {
  trips: TripWithGroup[];
  /** ISO yyyy-mm – month to render (defaults: month with the most density). */
  month?: string;
}

function tone(count: number) {
  if (count === 0) return "bg-slate-50 text-slate-400";
  if (count === 1) return "bg-sky-100 text-sky-900";
  if (count === 2) return "bg-sky-300 text-sky-950";
  if (count <= 4) return "bg-emerald-400 text-emerald-950";
  return "bg-emerald-600 text-white";
}

function densityByDate(trips: TripWithGroup[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of trips) {
    for (const d of eachDateInclusive(t.arrival, t.departure)) {
      m.set(d, (m.get(d) ?? 0) + 1);
    }
  }
  return m;
}

function monthCells(year: number, month0: number): (string | null)[] {
  const first = new Date(year, month0, 1);
  const startPad = first.getDay();
  const daysIn = new Date(year, month0 + 1, 0).getDate();
  const cells: (string | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= daysIn; d++) {
    const iso = `${year}-${String(month0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(iso);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarHeatmap({ trips, month }: Props) {
  const density = densityByDate(trips);
  // pick a month: provided, or the first trip's month
  const sample = month ?? trips[0]?.arrival ?? "2026-05-01";
  const [yStr, mStr] = sample.split("-");
  const year = Number(yStr);
  const month0 = Number(mStr) - 1;

  const cells = monthCells(year, month0);
  const monthLabel = new Date(year, month0, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{monthLabel}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Lower</span>
          <span className="h-3 w-3 rounded-sm bg-sky-100" />
          <span className="h-3 w-3 rounded-sm bg-sky-300" />
          <span className="h-3 w-3 rounded-sm bg-emerald-400" />
          <span className="h-3 w-3 rounded-sm bg-emerald-600" />
          <span>Higher density</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="pb-1 text-center font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <div key={i} className="aspect-square" />;
          const count = density.get(iso) ?? 0;
          const day = Number(iso.slice(8));
          return (
            <Link
              key={i}
              href={`/discover/matches?date=${iso}`}
              className={cn(
                "group aspect-square rounded-md p-1.5 text-left transition hover:ring-2 hover:ring-primary",
                tone(count),
              )}
            >
              <div className="text-[11px] font-medium">{day}</div>
              {count > 0 && (
                <div className="mt-1 text-[10px] font-semibold opacity-80">
                  {count} {count === 1 ? "group" : "groups"}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
