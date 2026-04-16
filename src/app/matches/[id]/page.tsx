import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MatchChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Matched conversation</p>
          <h1 className="font-display text-2xl font-semibold">
            The Kim Family ↔ Raj-Patel Crew
          </h1>
        </div>
        <Badge variant="default">Agent suggested</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shared trip — May 14, Hollywood Studios VIP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Bubble who="them">
            Hi Sarah! Priya here. Devin (our agent) mentioned you have a similar
            kid age range. We&apos;re targeting Galaxy&apos;s Edge first thing.
          </Bubble>
          <Bubble who="me">
            Hey! Yes, May 14 works. Our 9yo is mildly thrill-curious so Rise of the
            Resistance is doable. 😊
          </Bubble>
          <Bubble who="them">
            Perfect. Maya is putting together pricing for a 7-hour guide split
            between our two families. ~$1,800/family.
          </Bubble>
          <div className="flex gap-2 pt-2">
            <Input placeholder="Type a message…" />
            <Button>Send</Button>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm">Request agent help</Button>
            <Button variant="outline" size="sm">Mark booked</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Bubble({ who, children }: { who: "me" | "them"; children: React.ReactNode }) {
  return (
    <div className={who === "me" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          (who === "me"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground") +
          " max-w-[75%] rounded-2xl px-4 py-2 text-sm"
        }
      >
        {children}
      </div>
    </div>
  );
}
