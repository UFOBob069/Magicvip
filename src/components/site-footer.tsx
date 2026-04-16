import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-muted/30">
      <div className="container py-10 text-sm text-muted-foreground">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-base font-semibold text-foreground">
              Magic VIP Match
            </div>
            <p className="mt-2 max-w-xs">
              Coordinate small travel groups to share the cost of private VIP-style
              theme park tours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/how-it-works" className="hover:text-foreground">How it works</Link>
            <Link href="/discover/calendar" className="hover:text-foreground">Calendar</Link>
            <Link href="/discover/matches" className="hover:text-foreground">Matches</Link>
            <Link href="/agent" className="hover:text-foreground">For agents</Link>
            <Link href="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
          <div className="rounded-lg border bg-background p-4 text-xs leading-relaxed">
            <strong className="text-foreground">Independence notice.</strong>{" "}
            Magic VIP Match is an independent platform and is not affiliated with
            or endorsed by The Walt Disney Company. Park names are used
            descriptively to indicate venue location only.
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs">
          © {new Date().getFullYear()} Magic VIP Match
        </div>
      </div>
    </footer>
  );
}
