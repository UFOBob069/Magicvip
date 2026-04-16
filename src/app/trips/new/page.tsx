import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function NewTripPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Step 2 of 2</p>
          <h1 className="font-display text-3xl font-semibold">Add your trip dates</h1>
        </div>
        <Badge variant="muted">~ 2 minutes</Badge>
      </div>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>When are you going?</CardTitle>
            <CardDescription>
              Block out your full trip — we&apos;ll find the best shared VIP day.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="arrival">Arrival</Label>
              <Input id="arrival" type="date" defaultValue="2026-05-12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="departure">Departure</Label>
              <Input id="departure" type="date" defaultValue="2026-05-17" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Park plan</CardTitle>
            <CardDescription>
              Optional — helps with park overlap matching. Leave blank if you&apos;re not sure yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {["2026-05-13", "2026-05-14", "2026-05-15", "2026-05-16"].map((d) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium tabular-nums">{d}</span>
                <select className="flex h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm">
                  <option value="">No park</option>
                  <option value="MK">Magic Kingdom</option>
                  <option value="EPCOT">EPCOT</option>
                  <option value="HS">Hollywood Studios</option>
                  <option value="AK">Animal Kingdom</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <input type="checkbox" /> Ideal VIP day
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open seats & willingness</CardTitle>
            <CardDescription>How many other guests can fit your VIP day?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="seats">Open seats</Label>
              <Input id="seats" type="number" defaultValue={3} min={0} max={8} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="willingness">Willingness</Label>
              <select id="willingness" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="either">Open to either</option>
                <option value="join">Want to join others</option>
                <option value="host">Want to host others</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="flexible">Flexible on dates?</Label>
              <select id="flexible" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="yes">Yes — open to ±2 days</option>
                <option value="no">No — these dates are fixed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button">Back</Button>
          <Button type="submit">Publish & see matches →</Button>
        </div>
      </form>
    </div>
  );
}
