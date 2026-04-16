import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, MapPin, CalendarDays, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { fmtDateRange } from "@/lib/utils";
import { PARK_LABEL } from "@/lib/types";
import { demoTripsWithGroups } from "@/lib/seed-data";
import { vibeSummary, openSeatsLine } from "@/lib/vibe";

export default function PublicTripPage({ params }: { params: { tripId: string } }) {
  const trip = demoTripsWithGroups.find((t) => t.id === params.tripId);
  if (!trip) notFound();
  const g = trip.group;

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Public profile</p>
          <h1 className="font-display text-3xl font-semibold">{g.name}</h1>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">
              <MapPin className="mr-1 inline h-3 w-3" /> {g.homeCity}, {g.homeState}
            </Badge>
            <Badge variant="muted">
              <Users className="mr-1 inline h-3 w-3" /> {g.adults} adults
              {g.kidsCount > 0 ? ` · kids ${g.kidsAges.join(", ")}` : ""}
            </Badge>
            {g.agentReviewed && (
              <Badge variant="success">
                <ShieldCheck className="mr-1 inline h-3 w-3" /> Agent reviewed
              </Badge>
            )}
          </div>
          <CardTitle className="pt-4 text-base">About this group</CardTitle>
          <CardDescription>{vibeSummary(g)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="rounded-md bg-muted/40 p-3 italic">{g.bio}</p>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Trip
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{fmtDateRange(trip.arrival, trip.departure)}</span>
                {trip.flexible && <Badge variant="info">Flexible</Badge>}
              </div>
              {openSeatsLine(trip) && (
                <div className="text-amber-900">
                  <strong>{openSeatsLine(trip)}</strong>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Park plan:{" "}
                {Object.entries(trip.parkDays)
                  .map(([d, p]) => `${d.slice(5)} ${PARK_LABEL[p]}`)
                  .join(" · ")}
              </div>
            </div>
          </div>

          <div className="rounded-md border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
            <Lock className="mr-1.5 inline h-3.5 w-3.5" />
            Last name, contact info, and exact accommodation are revealed only after
            both groups accept the match.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" asChild>
              <Link href="/discover/matches">Back to matches</Link>
            </Button>
            <Button asChild>
              <Link href={`/requests?to=${trip.id}`}>Request match</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
