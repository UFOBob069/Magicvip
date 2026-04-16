import Link from "next/link";
import { Users, MapPin, CalendarDays, ShieldCheck, Sparkle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CompatibilityMeter } from "@/components/compatibility-meter";
import { StatusBadge } from "@/components/status-badge";
import { fmtDateRange } from "@/lib/utils";
import type { MatchResult, TripWithGroup } from "@/lib/types";
import { vibeSummary } from "@/lib/vibe";

interface Props {
  trip: TripWithGroup;
  result: MatchResult;
  agentSuggested?: boolean;
}

export function MatchCard({ trip, result, agentSuggested }: Props) {
  const g = trip.group;
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold leading-tight">
                {g.name}
              </h3>
              {g.agentReviewed && (
                <span title="Agent reviewed" className="text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <MapPin className="mr-1 inline h-3 w-3" />
              {g.homeCity}, {g.homeState}
            </p>
          </div>
          <StatusBadge status={trip.status} />
        </div>
        <CompatibilityMeter score={result.score} />
        {agentSuggested && (
          <Badge variant="default" className="w-fit gap-1">
            <Sparkle className="h-3 w-3" /> Agent suggested
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <p className="text-muted-foreground">{vibeSummary(g)}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{fmtDateRange(trip.arrival, trip.departure)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {g.adults} adult{g.adults === 1 ? "" : "s"}
              {g.kidsCount > 0 && ` · kids ${g.kidsAges.join(", ")}`}
            </span>
          </div>
        </div>
        {trip.openSeats > 0 && (
          <div className="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            {trip.openSeats} open seat{trip.openSeats === 1 ? "" : "s"}
            {result.suggestedDate && ` · target ${result.suggestedDate}`}
          </div>
        )}
        {result.reasons.length > 0 && (
          <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
            <strong className="text-slate-900">Why this match:</strong>{" "}
            {result.reasons.join(" · ")}
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/discover/groups/${trip.id}`}>View profile</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/requests?to=${trip.id}`}>Request match</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
