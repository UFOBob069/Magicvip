import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="container max-w-md py-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to manage your travel group and review match requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
          <div className="relative text-center text-xs text-muted-foreground">
            <span className="relative bg-background px-2">or with email</span>
            <div className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-border" />
          </div>
          <form className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <Button type="submit" className="w-full">
              Send magic link
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link href="/groups/new" className="underline underline-offset-4">
              Create your travel group
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
