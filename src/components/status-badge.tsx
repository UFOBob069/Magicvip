import { Badge } from "@/components/ui/badge";
import type { TripStatus } from "@/lib/types";

const MAP: Record<
  TripStatus,
  { label: string; variant: "default" | "info" | "warning" | "success" | "muted" }
> = {
  seeking: { label: "Seeking match", variant: "info" },
  partial: { label: "Partially matched", variant: "warning" },
  coordinating: { label: "Agent coordinating", variant: "default" },
  booked: { label: "Booked", variant: "success" },
};

export function StatusBadge({ status }: { status: TripStatus }) {
  const { label, variant } = MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
