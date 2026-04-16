import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { demoTripsWithGroups } from "@/lib/seed-data";

export default function RequestsPage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  const target = searchParams.to
    ? demoTripsWithGroups.find((t) => t.id === searchParams.to)
    : undefined;

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl font-semibold">Match requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Send an intro to lock in a date and unlock fuller profiles.
      </p>

      {target && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Send a request to {target.group.name}</CardTitle>
              <Badge variant="info">draft</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              defaultValue={`Hi ${target.group.organizerFirst}! We're a family of ${target.group.adults + target.group.kidsCount} from Austin, TX visiting May 12–17. We're targeting a VIP day on May 14 (MK) and would love to share a guide with you. Open to chatting!`}
              rows={5}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save draft</Button>
              <Button>Send request</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="mt-10 font-display text-xl font-semibold">Inbox</h2>
      <div className="mt-4 grid gap-3">
        <Inbox name="Marcus T. (Team Tatum)" status="pending" body="Hey Sarah — May 14 looks great. Want to grab the guide together?" />
        <Inbox name="Priya R. (Raj-Patel Crew)" status="accepted" body="Yes! Let's coordinate Hollywood Studios on the 14th." />
        <Inbox name="Jenna L. (Lopez Twins)" status="declined" body="Thanks — going with relaxed pace this round, but appreciate it!" />
      </div>
    </div>
  );
}

function Inbox({
  name,
  status,
  body,
}: {
  name: string;
  status: "pending" | "accepted" | "declined";
  body: string;
}) {
  const map = {
    pending: { variant: "info" as const, label: "Pending" },
    accepted: { variant: "success" as const, label: "Accepted" },
    declined: { variant: "muted" as const, label: "Declined" },
  };
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{name}</div>
            <Badge variant={map[status].variant}>{map[status].label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
        {status === "accepted" && (
          <Button asChild size="sm">
            <Link href="/matches/m1">Open chat</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
