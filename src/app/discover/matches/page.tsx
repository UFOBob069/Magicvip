import { MatchCard } from "@/components/match-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoTripsWithGroups } from "@/lib/seed-data";
import { rankMatches } from "@/lib/matching";

export default function MatchesPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  // Pretend logged-in user owns trip "t1".
  const me = demoTripsWithGroups.find((t) => t.id === "t1")!;
  const ranked = rankMatches(me, demoTripsWithGroups);
  const dateFilter = searchParams.date;
  const filtered = dateFilter
    ? ranked.filter(
        ({ trip }) => dateFilter >= trip.arrival && dateFilter <= trip.departure,
      )
    : ranked;

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Discovery</p>
          <h1 className="font-display text-3xl font-semibold">Compatible groups</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sorted by compatibility. {dateFilter ? `Filtered to ${dateFilter}.` : "Showing all overlapping trips."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="muted">{filtered.length} matches</Badge>
          {dateFilter && (
            <Badge variant="info">date: {dateFilter}</Badge>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No matches yet for this filter</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Try a different date — or set your trip to <strong>flexible</strong> on
            your dashboard to widen the pool.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ trip, result }) => (
            <MatchCard
              key={trip.id}
              trip={trip}
              result={result}
              agentSuggested={result.score >= 90}
            />
          ))}
        </div>
      )}
    </div>
  );
}
