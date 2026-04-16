import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Sparkle,
  ShieldCheck,
  Users,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroParticles } from "@/components/hero-particles";

export default function LandingPage() {
  return (
    <>
      {/* ──────────────────────────── HERO ──────────────────────────── */}
      <section className="relative isolate overflow-hidden text-white">
        {/* Base dark gradient: navy → indigo */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              "linear-gradient(180deg, #0B1B2B 0%, #121F36 50%, #1E2A44 100%)",
          }}
        />

        {/* Ambient "warm lights at dusk" layer — pure CSS, blurred radial washes */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 18% 85%, rgba(230, 192, 104, 0.22), transparent 60%),
              radial-gradient(ellipse 50% 40% at 82% 20%, rgba(120, 148, 255, 0.20), transparent 60%),
              radial-gradient(ellipse 40% 35% at 65% 90%, rgba(242, 165, 138, 0.14), transparent 60%)
            `,
            filter: "blur(18px)",
          }}
        />

        {/* Soft central halo behind the headline */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 30% 40%, rgba(230, 192, 104, 0.10), transparent 65%)",
          }}
        />

        {/* Floating particles / bokeh */}
        <HeroParticles />

        <div className="container relative py-24 md:py-32">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <Badge
                variant="muted"
                className="mb-5 border-white/10 bg-white/5 text-white/80 backdrop-blur"
              >
                <Sparkle className="mr-1.5 h-3 w-3 text-amber-200" />
                Independent platform — not affiliated with The Walt Disney Company
              </Badge>

              <h1
                className="font-display text-4xl font-semibold tracking-tight md:text-6xl"
                style={{ letterSpacing: "-0.01em", lineHeight: 1.08 }}
              >
                Share a <span className="mvm-text-gold">private VIP day</span>.
                <br />
                <span className="text-white/90">Skip the Facebook chaos.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Magic VIP Match helps small travel groups find compatible families
                going to Disney parks the same week — and split the cost of a
                private VIP tour, with a real travel agent in the loop.
              </p>

              <p className="mt-3 max-w-xl text-base italic text-white/55">
                The best park day you&apos;ll have all year — now easier to plan.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="mvm-cta mvm-shimmer-target group h-12 px-7 text-base" asChild>
                  <Link href="/groups/new">
                    <span>Find your VIP group</span>
                    <Sparkle className="ml-2 h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 bg-white/5 px-7 text-base text-white backdrop-blur hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href="/discover/calendar">See who&apos;s going</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/70">
                <TrustPill
                  icon={<ShieldCheck className="h-4 w-4 text-emerald-300" />}
                  label="Agent-reviewed groups"
                />
                <TrustPill
                  icon={<Users className="h-4 w-4 text-sky-300" />}
                  label="Verified emails"
                />
                <TrustPill
                  icon={<Sparkle className="h-4 w-4 text-amber-200" />}
                  label="No public last names"
                />
              </div>
            </div>

            {/* Preview match card cluster — glass surfaces floating against the dusk */}
            <div className="relative h-[420px]">
              <HeroMatchCard
                className="absolute right-0 top-0 w-[360px] rotate-[1.5deg]"
                score={94}
                title="The Kim Family"
                city="Austin, TX"
                vibe="Sarah’s family · 2 kids (7 & 9) · balanced pace · rides, food, characters."
                seats="3 spots left · May 14 — Magic Kingdom"
                reasons={[
                  "4 overlapping days",
                  "Kids ages align (7–9)",
                  "Both prefer balanced pace",
                  "Same Magic Kingdom target",
                ]}
                featured
              />
              <HeroMatchCard
                className="absolute left-0 bottom-4 hidden w-[300px] -rotate-[2deg] md:block"
                score={81}
                title="Devin & Kate"
                city="Orlando, FL"
                vibe="Locals, no kids · frequent visitors · looking to split a VIP day."
                seats="6 spots left · June 25"
              />
            </div>
          </div>
        </div>

        {/* Soft fade to the next section */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-24"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(11, 27, 43, 1) 100%)",
          }}
        />
      </section>

      {/* ──────────────────────── HOW IT WORKS ──────────────────────── */}
      <section className="relative isolate overflow-hidden text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #0B1B2B 0%, #111C32 50%, #1A2540 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 50% 35% at 50% 10%, rgba(230,192,104,0.06), transparent 70%)",
          }}
        />
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
              How it works
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              A quieter way to plan the <span className="mvm-text-gold">best day</span> of the trip.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-5 w-5" />,
                title: "Create your travel group",
                body: "Tell us who's going, your kids' ages, your pace, and your dates. Takes about four minutes.",
              },
              {
                icon: <CalendarRange className="h-5 w-5" />,
                title: "See the calendar",
                body: "A density heatmap shows when other families are visiting. Click any day to see compatible groups.",
              },
              {
                icon: <Sparkle className="h-5 w-5" />,
                title: "Match & book",
                body: "Request a match, chat once accepted, and a travel agent finalizes the private VIP tour for everyone.",
              },
            ].map((step, i) => (
              <div key={i} className="mvm-glass relative rounded-2xl p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#3a4fbf] to-[#5472ff] text-white shadow-[0_0_16px_rgba(80,120,255,0.4)]">
                  {step.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────── CLOSER ──────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              "linear-gradient(180deg, #1A2540 0%, #2a2f52 45%, #c8a98f 85%, #F5E9DA 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 90%, rgba(230, 192, 104, 0.25), transparent 70%)",
          }}
        />
        <div className="container py-24 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/55">
            Math that changes the math
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            VIP tours are expensive for one family.
            <br />
            <span className="mvm-text-gold">Affordable for two.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/75">
            A private guide runs $450–$900/hour with a seven-hour minimum.
            Splitting with one or two compatible families turns a fantasy into a
            line item.
          </p>
          <Button size="lg" className="mvm-cta mvm-shimmer-target mt-9 h-12 px-8 text-base" asChild>
            <Link href="/groups/new">
              Get started — it&apos;s free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── helpers ───────────────────────── */

function TrustPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
      title={label}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}

interface HeroMatchCardProps {
  className?: string;
  score: number;
  title: string;
  city: string;
  vibe: string;
  seats?: string;
  reasons?: string[];
  featured?: boolean;
}

function HeroMatchCard({
  className,
  score,
  title,
  city,
  vibe,
  seats,
  reasons,
  featured,
}: HeroMatchCardProps) {
  return (
    <Card
      className={
        "mvm-glass border-0 text-white transition duration-300 hover:-translate-y-1 " +
        (className ?? "")
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-display text-lg font-semibold">
              <Sparkle className="mr-1.5 inline h-4 w-4 text-amber-200" />
              {title}
            </CardTitle>
            <p className="mt-0.5 text-xs text-white/60">{city}</p>
          </div>
          <span
            className={
              "mvm-match-pill inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold " +
              (featured ? "mvm-pulse" : "")
            }
          >
            <Sparkle className="h-3 w-3" />
            {score}% match
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-white/70">{vibe}</p>
        {seats && (
          <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-xs font-medium text-amber-100">
            <Ticket className="h-3.5 w-3.5" />
            {seats}
          </div>
        )}
        {reasons && reasons.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
              ✦ Why this is a great match
            </div>
            <ul className="mt-1.5 space-y-1 text-xs text-white/80">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-200" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
