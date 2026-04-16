import Link from "next/link";
import {
  Users,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Sparkle,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
  const featured = result.score >= 90;

  return (
    <Card className="mvm-card group flex h-full flex-col overflow-hidden border-0">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Sparkle className="h-4 w-4 shrink-0 text-amber-500/80" />
              <h3 className="truncate font-display text-lg font-semibold leading-tight">
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

        <div className="flex items-center gap-2">
          <span
            className={
              "mvm-match-pill inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold " +
              (featured ? "mvm-pulse" : "")
            }
          >
            <Sparkle className="h-3 w-3" />
            {result.score}% match
          </span>
          {agentSuggested && (
            <Badge
              variant="default"
              className="gap-1 bg-gradient-to-br from-[#1b2a4e] to-[#3a4fbf] text-white shadow-[0_0_12px_rgba(80,120,255,0.3)]"
            >
              <Sparkle className="h-3 w-3" /> Agent suggested
            </Badge>
          )}
        </div>
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
          <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-300/40 bg-gradient-to-r from-amber-50 to-amber-100/60 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-[0_0_10px_rgba(230,192,104,0.18)]">
            <Ticket className="h-3.5 w-3.5" />
            {trip.openSeats} spot{trip.openSeats === 1 ? "" : "s"} left
            {result.suggestedDate && ` · ${result.suggestedDate}`}
          </div>
        )}

        {result.reasons.length > 0 && (
          <div className="rounded-lg border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              ✦ Why this is a great match
            </div>
            <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  <span className="capitalize-first">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/discover/groups/${trip.id}`}>View profile</Link>
        </Button>
        <Button size="sm" className="mvm-cta mvm-shimmer-target" asChild>
          <Link href={`/requests?to=${trip.id}`}>Request match</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
