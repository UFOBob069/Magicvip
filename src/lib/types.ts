export type UserRole = "traveler" | "agent";

export type ExperienceLevel = "first_time" | "few_times" | "frequent";
export type Pace = "relaxed" | "balanced" | "maximize";
export type Willingness = "join" | "host" | "either";
export type TripStatus = "seeking" | "partial" | "coordinating" | "booked";
export type PipelineStage =
  | "new"
  | "exploring"
  | "matched"
  | "coordinating"
  | "booked";

export type Interest =
  | "rides"
  | "food"
  | "characters"
  | "star_wars"
  | "thrill"
  | "mixed";

export type Park = "MK" | "EPCOT" | "HS" | "AK";

export const PARK_LABEL: Record<Park, string> = {
  MK: "Magic Kingdom",
  EPCOT: "EPCOT",
  HS: "Hollywood Studios",
  AK: "Animal Kingdom",
};

export interface TravelGroup {
  id: string;
  ownerId: string;
  name: string;
  organizerFirst: string;
  homeCity: string;
  homeState: string;
  adults: number;
  kidsCount: number;
  kidsAges: number[];
  experienceLevel: ExperienceLevel;
  pastVisits: number;
  vipExperience: boolean;
  pace: Pace;
  interests: Interest[];
  bio: string;
  mobilityNotes?: string;
  earlyRiser?: boolean;
  parkHopper?: boolean;
  budgetComfort?: "value" | "mid" | "premium";
  completenessScore: number;
  isPublished: boolean;
  agentReviewed?: boolean;
}

export interface Trip {
  id: string;
  groupId: string;
  arrival: string; // ISO date
  departure: string; // ISO date
  parkDays: Record<string, Park>;
  idealVipDays: string[];
  flexible: boolean;
  openSeats: number;
  willingness: Willingness;
  status: TripStatus;
}

export interface TripWithGroup extends Trip {
  group: TravelGroup;
}

export interface MatchResult {
  score: number;
  reasons: string[];
  suggestedDate: string | null;
  isAgentSuggested?: boolean;
}

export interface MatchedPair {
  id: string;
  a: TripWithGroup;
  b: TripWithGroup;
  result: MatchResult;
}

export interface PipelineEntry {
  tripId: string;
  stage: PipelineStage;
  notes?: string;
  updatedAt: string;
}
