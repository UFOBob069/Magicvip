import Link from "next/link";
import { ArrowRight, CalendarRange, Sparkle, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-background to-emerald-50" />
        <div className="container py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge variant="muted" className="mb-4">
                Independent platform — not affiliated with The Walt Disney Company
              </Badge>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Share a private VIP day. <br />
                <span className="text-primary">Skip the Facebook chaos.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Magic VIP Match helps small travel groups find compatible families
                going to Disney parks the same week — and split the cost of a
                private VIP tour, with a real travel agent in the loop.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/groups/new">
                    Find your VIP group <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/discover/calendar">See who&apos;s going</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Agent-reviewed groups
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-sky-600" /> Verified emails
                </span>
              </div>
            </div>

            <div className="relative">
              <Card className="rotate-1 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">The Kim Family · Austin, TX</CardTitle>
                    <Badge variant="success">94 match</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Sarah&apos;s family · 2 kids (7 & 9), been a few times, balanced
                    pace, looking for rides + food + characters.
                  </p>
                  <div className="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                    3 open seats · target May 14 (Magic Kingdom)
                  </div>
                  <div className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
                    <strong>Why this match:</strong> 4 overlapping days · similar
                    kid ages · both balanced pace · both targeting Magic Kingdom 5/14
                  </div>
                </CardContent>
              </Card>
              <Card className="absolute -bottom-4 -left-4 -rotate-2 hidden w-72 shadow-xl md:block">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Devin & Kate · Orlando</CardTitle>
                    <Badge variant="info">81 match</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Locals, no kids. 6 open seats for June 25.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <h2 className="font-display text-3xl font-semibold">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Users className="h-5 w-5" />,
              title: "Create your travel group",
              body: "Tell us who's going, your kids' ages, your pace, and your dates. Takes about 4 minutes.",
            },
            {
              icon: <CalendarRange className="h-5 w-5" />,
              title: "See the calendar",
              body: "A density heatmap shows the dates when other families are visiting. Click any day to see compatible groups.",
            },
            {
              icon: <Sparkle className="h-5 w-5" />,
              title: "Match & book",
              body: "Request a match, chat once accepted, and a travel agent finalizes the private VIP tour for everyone.",
            },
          ].map((step, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                  {step.icon}
                </div>
                <CardTitle className="mt-3 text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container py-16 text-center">
          <h2 className="font-display text-3xl font-semibold">
            VIP tours are too expensive for one family.
            <br />
            They&apos;re affordable for two.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A private guide runs $450–$900/hour with a 7-hour minimum. Splitting
            with one or two compatible families turns it from a fantasy into a
            line item.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/groups/new">Get started — it&apos;s free</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
