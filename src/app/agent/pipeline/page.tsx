import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PipelineBoard } from "@/components/pipeline-board";
import { demoPipeline, demoTripsWithGroups } from "@/lib/seed-data";

export default function AgentPipelinePage() {
  return (
    <div className="container max-w-7xl py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Agent · Pipeline</p>
          <h1 className="font-display text-3xl font-semibold">Trip pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag trips between stages as you coordinate. Private notes are invisible to travelers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/agent">Back to overview</Link>
          </Button>
          <Button asChild>
            <Link href="/agent/suggest">+ Suggested group</Link>
          </Button>
        </div>
      </div>

      <PipelineBoard entries={demoPipeline} trips={demoTripsWithGroups} />
    </div>
  );
}
