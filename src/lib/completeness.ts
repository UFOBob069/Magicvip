import type { TravelGroup } from "./types";

export function completenessScore(g: Partial<TravelGroup>): number {
  let score = 0;
  if (g.name) score += 8;
  if (g.organizerFirst) score += 6;
  if (g.homeCity && g.homeState) score += 8;
  if (g.adults && g.adults > 0) score += 6;
  if ((g.kidsAges?.length ?? 0) === (g.kidsCount ?? 0)) score += 8;
  if (g.experienceLevel) score += 8;
  if (g.pace) score += 8;
  if ((g.interests?.length ?? 0) >= 2) score += 12;
  if (g.bio && g.bio.length >= 80) score += 20;
  else if (g.bio && g.bio.length >= 30) score += 10;
  if (g.budgetComfort) score += 6;
  if (g.parkHopper !== undefined) score += 5;
  if (g.earlyRiser !== undefined) score += 5;
  return Math.min(100, score);
}
