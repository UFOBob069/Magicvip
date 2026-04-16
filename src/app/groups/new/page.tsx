import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function NewGroupPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Step 1 of 2</p>
          <h1 className="font-display text-3xl font-semibold">Create your travel group</h1>
        </div>
        <Badge variant="muted">~ 4 minutes</Badge>
      </div>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Group basics</CardTitle>
            <CardDescription>What should other families call you?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Group name" id="name" placeholder="The Kim Family" />
            <Field label="Organizer first name" id="organizer" placeholder="Sarah" />
            <Field label="Home city" id="city" placeholder="Austin" />
            <Field label="State / region" id="state" placeholder="TX" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composition</CardTitle>
            <CardDescription>Who&apos;s coming along?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Field label="Adults" id="adults" type="number" defaultValue={2} />
            <Field label="Kids" id="kids" type="number" defaultValue={2} />
            <Field label="Kids ages (comma)" id="kidsAges" placeholder="7, 9" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style</CardTitle>
            <CardDescription>Help us match you with compatible families.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Selector
              label="Pace"
              id="pace"
              options={[
                ["relaxed", "Relaxed"],
                ["balanced", "Balanced"],
                ["maximize", "Maximize rides"],
              ]}
            />
            <Selector
              label="Disney experience"
              id="exp"
              options={[
                ["first_time", "First time"],
                ["few_times", "Been a few times"],
                ["frequent", "Frequent visitor"],
              ]}
            />
            <ChipPicker
              label="Interests"
              id="interests"
              options={["rides", "food", "characters", "star_wars", "thrill", "mixed"]}
            />
            <Selector
              label="Budget comfort"
              id="budget"
              options={[
                ["value", "Value"],
                ["mid", "Mid-range"],
                ["premium", "Premium"],
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tell other families about you</CardTitle>
            <CardDescription>
              A short, warm bio is the #1 driver of accepted matches. Aim for 80–280
              characters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Easygoing TX family — kids love dark rides and Mickey waffles. Open to teaming up with another family with similar-aged kids."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button">Save draft</Button>
          <Button type="submit">Continue to trip dates →</Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  ...rest
}: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
}

function Selector({
  label,
  id,
  options,
}: {
  label: string;
  id: string;
  options: [string, string][];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Choose…</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChipPicker({
  label,
  id,
  options,
}: {
  label: string;
  id: string;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label
            key={o}
            className="cursor-pointer rounded-full border bg-background px-3 py-1 text-xs hover:bg-accent"
          >
            <input type="checkbox" value={o} className="sr-only" /> {o.replace("_", " ")}
          </label>
        ))}
      </div>
    </div>
  );
}
