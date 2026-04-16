import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompatibilityMeter } from "@/components/compatibility-meter";
import { StatusBadge } from "@/components/status-badge";
import { fmtDateRange } from "@/lib/utils";
import { demoTripsWithGroups } from "@/lib/seed-data";
import { rankMatches } from "@/lib/matching";
import { vibeSummary } from "@/lib/vibe";

export default function DashboardPage() {
  // Pretend the logged-in traveler owns Sarah's group ("g1") with trip "t1".
  const me = demoTripsWithGroups.find((t) => t.id === "t1")!;
  const matches = rankMatches(me, demoTripsWithGroups).slice(0, 3);

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, Sarah</p>
          <h1 className="font-display text-3xl font-semibold">Your dashboard</h1>
        </div>
        <Button asChild>
          <Link href="/trips/new"><Plus className="mr-1.5 h-4 w-4" /> New trip</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{me.group.name}</CardTitle>
              <StatusBadge status={me.status} />
            </div>
            <CardDescription>{vibeSummary(me.group)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Trip dates" value={fmtDateRange(me.arrival, me.departure)} />
              <Stat label="Open seats" value={`${me.openSeats}`} />
              <Stat label="Profile completeness" value={`${me.group.completenessScore}%`} />
              <Stat label="Past visits" value={`${me.group.pastVisits}`} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/groups/${me.groupId}`}>Edit group</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trips/${me.id}`}>Edit trip</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trust</CardTitle>
            <CardDescription>Boost your match acceptance rate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Trust label="Email verified" ok />
            <Trust label="Phone verified" />
            <Trust label="Agent reviewed" ok />
            <Button variant="outline" size="sm" className="mt-2 w-full">
              Verify phone
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Top matches for your trip</h2>
        <Button variant="ghost" asChild>
          <Link href="/discover/matches">
            See all <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {matches.map(({ trip, result }) => (
          <Card key={trip.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{trip.group.name}</CardTitle>
                <Badge variant="muted">
                  {trip.group.homeCity}, {trip.group.homeState}
                </Badge>
              </div>
              <CompatibilityMeter score={result.score} />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{vibeSummary(trip.group)}</p>
              <p className="mt-2 text-xs">
                Suggested VIP date: <strong>{result.suggestedDate}</strong>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function Trust({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      {ok ? (
        <Badge variant="success">Verified</Badge>
      ) : (
        <Badge variant="muted">Pending</Badge>
      )}
    </div>
  );
}
