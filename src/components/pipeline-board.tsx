import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fmtDateRange } from "@/lib/utils";
import type { PipelineEntry, PipelineStage, TripWithGroup } from "@/lib/types";

const STAGES: { key: PipelineStage; label: string; tone: string }[] = [
  { key: "new", label: "New", tone: "border-slate-300" },
  { key: "exploring", label: "Exploring", tone: "border-sky-400" },
  { key: "matched", label: "Matched", tone: "border-amber-400" },
  { key: "coordinating", label: "Coordinating", tone: "border-violet-400" },
  { key: "booked", label: "Booked", tone: "border-emerald-500" },
];

interface Props {
  entries: PipelineEntry[];
  trips: TripWithGroup[];
}

export function PipelineBoard({ entries, trips }: Props) {
  const byTrip = new Map(trips.map((t) => [t.id, t]));
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {STAGES.map((s) => {
        const items = entries.filter((e) => e.stage === s.key);
        return (
          <div key={s.key} className={`rounded-xl border-t-4 bg-muted/30 p-3 ${s.tone}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">{s.label}</div>
              <Badge variant="muted">{items.length}</Badge>
            </div>
            <div className="space-y-2">
              {items.length === 0 && (
                <div className="rounded-md border border-dashed bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No trips
                </div>
              )}
              {items.map((e) => {
                const t = byTrip.get(e.tripId);
                if (!t) return null;
                return (
                  <Card key={e.tripId} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold">{t.group.name}</div>
                      {t.openSeats > 0 && (
                        <Badge variant="warning">{t.openSeats} open</Badge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {fmtDateRange(t.arrival, t.departure)} · {t.group.homeCity}, {t.group.homeState}
                    </div>
                    {e.notes && (
                      <p className="mt-2 rounded bg-amber-50 p-2 text-[11px] leading-snug text-amber-900">
                        <strong>Note:</strong> {e.notes}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
