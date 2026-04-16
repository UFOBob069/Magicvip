import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompatibilityMeter } from "@/components/compatibility-meter";
import { fmtDateRange } from "@/lib/utils";
import { demoTripsWithGroups, demoPipeline } from "@/lib/seed-data";
import { rankMatches } from "@/lib/matching";
import { vibeSummary } from "@/lib/vibe";

export default function AgentDashboard() {
  const seekingTrips = demoTripsWithGroups.filter((t) => t.status === "seeking");

  // Top match suggestions agent could broadcast.
  const suggestions = seekingTrips
    .flatMap((trip) =>
      rankMatches(trip, demoTripsWithGroups)
        .slice(0, 1)
        .map((r) => ({ a: trip, b: r.trip, score: r.result.score, when: r.result.suggestedDate })),
    )
    .filter(
      (s, i, arr) =>
        i ===
        arr.findIndex(
          (x) =>
            (x.a.id === s.a.id && x.b.id === s.b.id) ||
            (x.a.id === s.b.id && x.b.id === s.a.id),
        ),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const pipelineCounts = {
    new: demoPipeline.filter((p) => p.stage === "new").length,
    exploring: demoPipeline.filter((p) => p.stage === "exploring").length,
    matched: demoPipeline.filter((p) => p.stage === "matched").length,
    coordinating: demoPipeline.filter((p) => p.stage === "coordinating").length,
    booked: demoPipeline.filter((p) => p.stage === "booked").length,
  };

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Agent dashboard · Maya Alvarez</p>
          <h1 className="font-display text-3xl font-semibold">Pipeline overview</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/agent/pipeline">Open Kanban</Link>
          </Button>
          <Button asChild>
            <Link href="/agent/suggest">Build a suggested group</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {Object.entries(pipelineCounts).map(([k, v]) => (
          <Card key={k}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{k}</div>
              <div className="mt-1 font-display text-3xl font-semibold tabular-nums">{v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Top match suggestions you could broadcast</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Use the suggest tool to bundle 2–3 trips into a single VIP group invite.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {suggestions.map((s) => (
          <Card key={`${s.a.id}-${s.b.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {s.a.group.name} ↔ {s.b.group.name}
                </CardTitle>
                <Badge variant="info">{s.when}</Badge>
              </div>
              <CompatibilityMeter score={s.score} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong>{s.a.group.name}:</strong> {fmtDateRange(s.a.arrival, s.a.departure)} · {s.a.openSeats} open
              </p>
              <p className="text-muted-foreground">
                <strong>{s.b.group.name}:</strong> {fmtDateRange(s.b.arrival, s.b.departure)} · {s.b.openSeats} open
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm">Add note</Button>
                <Button size="sm">Send suggestion</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">All published groups</h2>
      <div className="mt-4 grid gap-3">
        {demoTripsWithGroups.slice(0, 6).map((t) => (
          <Card key={t.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="font-semibold">{t.group.name}</div>
                <div className="text-xs text-muted-foreground">
                  {fmtDateRange(t.arrival, t.departure)} · {t.group.homeCity}, {t.group.homeState} · {vibeSummary(t.group).split(" — ")[1]}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="muted">{t.openSeats} open</Badge>
                <Badge variant="info">{t.status}</Badge>
                <Button variant="outline" size="sm">Open</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
