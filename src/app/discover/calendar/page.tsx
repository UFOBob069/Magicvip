import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarHeatmap } from "@/components/calendar-heatmap";
import { demoTripsWithGroups } from "@/lib/seed-data";

export default function CalendarDiscoveryPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Discovery</p>
          <h1 className="font-display text-3xl font-semibold">Overlap heatmap</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            See which dates have the highest density of compatible groups. Click a
            day to view matchable families.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/discover/matches">Switch to list view</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CalendarHeatmap trips={demoTripsWithGroups} month="2026-05-01" />
        <CalendarHeatmap trips={demoTripsWithGroups} month="2026-06-01" />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Hottest upcoming dates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            { date: "2026-05-14", count: 3, hint: "Magic Kingdom" },
            { date: "2026-06-25", count: 3, hint: "Mixed parks" },
            { date: "2026-07-10", count: 2, hint: "Magic Kingdom" },
          ].map((h) => (
            <Link
              key={h.date}
              href={`/discover/matches?date=${h.date}`}
              className="rounded-lg border p-4 transition hover:border-primary"
            >
              <div className="font-display text-lg font-semibold">{h.date}</div>
              <div className="text-xs text-muted-foreground">
                {h.count} groups · suggested park: {h.hint}
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
