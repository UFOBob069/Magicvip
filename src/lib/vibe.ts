import type { TravelGroup, Trip } from "./types";

const PACE_PHRASE: Record<TravelGroup["pace"], string> = {
  relaxed: "a relaxed",
  balanced: "a balanced",
  maximize: "a maximize-the-day",
};

const EXP_PHRASE: Record<TravelGroup["experienceLevel"], string> = {
  first_time: "first-timers",
  few_times: "been a few times",
  frequent: "frequent visitors",
};

export function vibeSummary(g: TravelGroup): string {
  const kids =
    g.kidsCount === 0
      ? "adults only"
      : `${g.kidsCount} kid${g.kidsCount === 1 ? "" : "s"} (${g.kidsAges.join(" & ")})`;
  const interests = g.interests.slice(0, 3).join(", ").replace(/_/g, " ");
  const exp =
    g.experienceLevel === "first_time"
      ? "first time"
      : `${EXP_PHRASE[g.experienceLevel]}${g.pastVisits ? ` (${g.pastVisits} past visits)` : ""}`;
  return `${g.organizerFirst}'s family from ${g.homeCity}, ${g.homeState} — ${kids}, ${exp}, looking for ${PACE_PHRASE[g.pace]} day with ${interests}.`;
}

export function openSeatsLine(t: Trip): string | null {
  if (t.openSeats <= 0) return null;
  const date = t.idealVipDays[0] ?? t.arrival;
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `Group has ${t.openSeats} spot${t.openSeats === 1 ? "" : "s"} remaining for ${formatted}`;
}
