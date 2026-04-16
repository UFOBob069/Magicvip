import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    n: "01",
    title: "Build your travel group profile",
    body: "Names, ages, pace, interests, and a short bio. Takes about 4 minutes. Profile completeness boosts your match acceptance rate.",
  },
  {
    n: "02",
    title: "Add your trip plan",
    body: "Arrival, departure, ideal VIP day, open seats, willingness to host or join. Mark dates as flexible to widen your match pool.",
  },
  {
    n: "03",
    title: "Discover compatible families",
    body: "Use the calendar heatmap or sortable card list. Each match shows a compatibility score (0–100) with a clear explanation.",
  },
  {
    n: "04",
    title: "Request a match",
    body: "Send an intro message. Once accepted, fuller profile details and chat unlock.",
  },
  {
    n: "05",
    title: "Hand off to a travel agent (optional)",
    body: "Our partner agents can finalize the VIP booking, collect payment, and coordinate the day. Some matches are agent-suggested for extra confidence.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="font-display text-4xl font-semibold">How Magic VIP Match works</h1>
      <p className="mt-3 text-muted-foreground">
        A premium, structured alternative to coordinating VIP days in chaotic Facebook groups.
      </p>
      <div className="mt-10 space-y-4">
        {steps.map((s) => (
          <Card key={s.n}>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <span className="font-display text-3xl font-semibold text-muted-foreground">{s.n}</span>
              <CardTitle className="text-lg">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
