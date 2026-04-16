import Link from "next/link";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="mvm-header-glow sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#1b2a4e] via-[#3a4fbf] to-[#5472ff] text-white shadow-[0_0_16px_rgba(80,120,255,0.4)] transition group-hover:shadow-[0_0_22px_rgba(120,160,255,0.55)]">
            <Sparkle className="h-4 w-4" />
          </span>
          Magic VIP Match
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/discover/calendar" className="text-muted-foreground transition hover:text-foreground">
            Calendar
          </Link>
          <Link href="/discover/matches" className="text-muted-foreground transition hover:text-foreground">
            Matches
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground transition hover:text-foreground">
            How it works
          </Link>
          <Link href="/agent" className="text-muted-foreground transition hover:text-foreground">
            Agent
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" className="mvm-cta mvm-shimmer-target" asChild>
            <Link href="/groups/new">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
