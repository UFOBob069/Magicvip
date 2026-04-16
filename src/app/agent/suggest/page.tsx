import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CompatibilityMeter } from "@/components/compatibility-meter";
import { fmtDateRange } from "@/lib/utils";
import { demoTripsWithGroups } from "@/lib/seed-data";
import { scoreMatch } from "@/lib/matching";

export default function AgentSuggestPage() {
  const a = demoTripsWithGroups.find((t) => t.id === "t1")!;
  const b = demoTripsWithGroups.find((t) => t.id === "t2")!;
  const score = scoreMatch(a, b);

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Agent · Suggest</p>
        <h1 className="font-display text-3xl font-semibold">Build a suggested VIP group</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick 2–3 compatible trips. Score is computed live; both sides receive an
          “Agent suggested” match invite that boosts trust.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[a, b].map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="text-base">{t.group.name}</CardTitle>
              <CardDescription>
                {fmtDateRange(t.arrival, t.departure)} · {t.group.homeCity}, {t.group.homeState}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Badge variant="muted">{t.openSeats} open seats</Badge>
              <p className="text-xs text-muted-foreground">{t.group.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Combined match preview</CardTitle>
          <CardDescription>
            Suggested date: <strong>{score.suggestedDate}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <CompatibilityMeter score={score.score} />
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {score.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium">Note to both families</label>
            <Textarea
              defaultValue={`Hi both — I think you'd make a great pair on ${score.suggestedDate}. Compatibility score ${score.score}. I can put together a 7-hour VIP guide split. Want me to send pricing? — Maya`}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Save as draft</Button>
            <Button>Send agent-suggested match</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
