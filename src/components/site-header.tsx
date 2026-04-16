import Link from "next/link";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkle className="h-4 w-4" />
          </span>
          Magic VIP Match
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/discover/calendar" className="text-muted-foreground hover:text-foreground">
            Calendar
          </Link>
          <Link href="/discover/matches" className="text-muted-foreground hover:text-foreground">
            Matches
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
            How it works
          </Link>
          <Link href="/agent" className="text-muted-foreground hover:text-foreground">
            Agent
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/groups/new">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
