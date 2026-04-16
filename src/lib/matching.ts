import {
  PARK_LABEL,
  type ExperienceLevel,
  type Interest,
  type MatchResult,
  type Pace,
  type TripWithGroup,
} from "./types";
import { eachDateInclusive, intersectDates } from "./utils";

// Weights — sum = 100. See README §6.
const W = {
  dateOverlap: 35,
  groupSize: 12,
  kidAge: 18,
  pace: 10,
  experience: 8,
  interests: 12,
  flexibility: 5,
} as const;

const PACE_ORDER: Pace[] = ["relaxed", "balanced", "maximize"];
const EXP_ORDER: ExperienceLevel[] = ["first_time", "few_times", "frequent"];

function jaccard<T>(a: T[], b: T[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  A.forEach((x) => {
    if (B.has(x)) inter++;
  });
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
}

function bestKidAgeFit(myKids: number[], theirKids: number[]): number {
  if (myKids.length === 0 && theirKids.length === 0) return 1;
  if (myKids.length === 0 || theirKids.length === 0) return 0.4;
  const fits = myKids.map((mine) => {
    const closest = Math.min(...theirKids.map((t) => Math.abs(t - mine)));
    return Math.max(0, 1 - closest / 6);
  });
  return fits.reduce((s, x) => s + x, 0) / fits.length;
}

function paceScore(a: Pace, b: Pace): number {
  const d = Math.abs(PACE_ORDER.indexOf(a) - PACE_ORDER.indexOf(b));
  return d === 0 ? 1 : d === 1 ? 0.5 : 0;
}

function expScore(a: ExperienceLevel, b: ExperienceLevel): number {
  const d = Math.abs(EXP_ORDER.indexOf(a) - EXP_ORDER.indexOf(b));
  return d === 0 ? 1 : d === 1 ? 0.6 : 0.3;
}

function groupSizeFit(adultsA: number, adultsB: number): number {
  const total = adultsA + adultsB;
  if (total <= 6) return 1;
  if (total <= 8) return 0.5;
  return 0;
}

function pickSuggestedDate(a: TripWithGroup, b: TripWithGroup): string | null {
  const overlap = intersectDates(a.arrival, a.departure, b.arrival, b.departure);
  if (overlap.length === 0) return null;
  const bothIdeal = overlap.find(
    (d) => a.idealVipDays.includes(d) && b.idealVipDays.includes(d),
  );
  if (bothIdeal) return bothIdeal;
  const eitherIdeal = overlap.find(
    (d) => a.idealVipDays.includes(d) || b.idealVipDays.includes(d),
  );
  if (eitherIdeal) return eitherIdeal;
  return overlap[Math.floor(overlap.length / 2)];
}

export function scoreMatch(a: TripWithGroup, b: TripWithGroup): MatchResult {
  // Hard gates
  if (a.status === "booked" || b.status === "booked") {
    return { score: 0, reasons: ["One side already booked"], suggestedDate: null };
  }
  const overlap = intersectDates(a.arrival, a.departure, b.arrival, b.departure);
  if (overlap.length === 0) {
    return { score: 0, reasons: ["No date overlap"], suggestedDate: null };
  }
  if (a.group.adults + b.group.adults > 8) {
    return { score: 0, reasons: ["Combined adults exceeds VIP guide ratio"], suggestedDate: null };
  }

  const aDays = eachDateInclusive(a.arrival, a.departure).length;
  const bDays = eachDateInclusive(b.arrival, b.departure).length;
  const overlapRatio = overlap.length / Math.max(aDays, bDays);

  const kAge = bestKidAgeFit(a.group.kidsAges, b.group.kidsAges);
  const pace = paceScore(a.group.pace, b.group.pace);
  const exp = expScore(a.group.experienceLevel, b.group.experienceLevel);
  const interests = jaccard<Interest>(a.group.interests, b.group.interests);
  const sizeFit = groupSizeFit(a.group.adults, b.group.adults);
  const flex =
    a.flexible || b.flexible ? 1 : 0.5;

  const raw =
    W.dateOverlap * overlapRatio +
    W.groupSize * sizeFit +
    W.kidAge * kAge +
    W.pace * pace +
    W.experience * exp +
    W.interests * interests +
    W.flexibility * flex;

  const score = Math.round(Math.max(0, Math.min(100, raw)));
  const suggestedDate = pickSuggestedDate(a, b);

  const reasons: string[] = [];
  reasons.push(`${overlap.length} overlapping day${overlap.length === 1 ? "" : "s"}`);
  if (kAge > 0.7 && a.group.kidsAges.length && b.group.kidsAges.length) {
    reasons.push(
      `similar kid ages (${a.group.kidsAges.join(",")} vs ${b.group.kidsAges.join(",")})`,
    );
  }
  if (pace === 1) reasons.push(`both prefer ${a.group.pace} pace`);
  if (interests >= 0.5) {
    const shared = a.group.interests.filter((i) => b.group.interests.includes(i));
    if (shared.length) reasons.push(`shared interests: ${shared.join(", ")}`);
  }
  if (suggestedDate && a.parkDays[suggestedDate] === b.parkDays[suggestedDate]) {
    reasons.push(
      `both targeting ${PARK_LABEL[a.parkDays[suggestedDate]]} on ${suggestedDate}`,
    );
  }
  if (a.flexible && b.flexible) reasons.push("both flexible on dates");

  return { score, reasons, suggestedDate };
}

export function rankMatches(
  me: TripWithGroup,
  others: TripWithGroup[],
): Array<{ trip: TripWithGroup; result: MatchResult }> {
  return others
    .filter((t) => t.id !== me.id && t.groupId !== me.groupId)
    .map((t) => ({ trip: t, result: scoreMatch(me, t) }))
    .filter((r) => r.result.score > 0)
    .sort((a, b) => b.result.score - a.result.score);
}
