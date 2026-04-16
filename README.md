# Magic VIP Match

> Coordinate small travel groups to share the cost of private VIP-style theme-park tours — structured, trustworthy, and assisted by a travel agent.

**Magic VIP Match is an independent platform and is not affiliated with or endorsed by The Walt Disney Company.**

---

## Table of contents

1. [Product summary](#1-product-summary)
2. [Tech architecture](#2-tech-architecture)
3. [Database schema](#3-database-schema)
4. [Page / route map](#4-page--route-map)
5. [UX flows](#5-ux-flows)
6. [Matching algorithm (with weights)](#6-matching-algorithm-with-weights)
7. [Admin (travel agent) workflow](#7-admin-travel-agent-workflow)
8. [MVP build plan (phased)](#8-mvp-build-plan-phased)
9. [Starter code scaffolding](#9-starter-code-scaffolding)
10. [Seed data](#10-seed-data)
11. [Risks and edge cases](#11-risks-and-edge-cases)
12. [Future roadmap](#12-future-roadmap)

---

## 1. Product summary

**Problem.** Private VIP tours at major theme parks cost $450–$900/hour with a 7-hour minimum. Two-to-three families splitting the cost makes them affordable, but today coordination happens in chaotic Facebook groups: low trust, no structure, no calendar, no facilitation.

**Solution.** A premium, calendar-first matching platform where families create a *Travel Group* + a *Trip Plan*, get auto-matched with compatible families on overlapping dates, and (optionally) hand off to a vetted travel agent who finalizes the booking.

**Why we win.**
- **Structured profiles** instead of forum posts.
- **Compatibility scoring** so the best match surfaces first.
- **Date-overlap heatmap** that turns "who else is going May 12?" into one glance.
- **Agent-in-the-loop** — the trust layer Facebook can't offer.
- **Open-seat urgency** — drives conversion the way Airbnb's "1 left" does.

**North-star metric.** Matched-and-booked VIP groups per month.

---

## 2. Tech architecture

### Stack — chosen, not optional

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router) + RSC** | Server components keep DB calls off the client; route groups model marketing vs. app cleanly; one-deploy story on Vercel. |
| Language | **TypeScript (strict)** | Matching/eligibility logic is too risky to ship in JS. |
| Styling | **Tailwind + shadcn/ui** | Premium feel without paying a design-system tax; we own the components. |
| Backend | **Supabase** | Postgres (real relations + window queries for the heatmap), Row-Level Security (per-user data isolation without writing an API tier), Auth (Google + email magic link), Storage (profile photos), Realtime (agent dashboard live pipeline). |
| Auth | **Supabase Auth** — Google + email OTP | No passwords. Lower friction = higher signup. |
| Hosting | **Vercel** (web) + **Supabase Cloud** (db) | Two managed services, no DevOps. |
| Email | **Resend** | Transactional only at MVP (match request, agent intro). |
| Analytics | **PostHog** | Funnel + session replay for matching UX iteration. |
| Errors | **Sentry** | |

### Why Supabase over Firebase

The matching algorithm needs **JOINs across groups, trips, and dates**, plus aggregate window functions for the heatmap. Firestore would force us into denormalized fan-out and client-side filtering — fine for chat, painful for "find groups whose `[arrival,departure]` overlaps mine and `kids_ages` is within ±3 of any of my kids." Postgres + PostGIS-style range types is the right tool. RLS gives us multi-tenant data isolation without an API layer.

### High-level architecture

```
┌───────────────────────┐       ┌─────────────────────────────┐
│   Next.js (Vercel)    │       │       Supabase Cloud        │
│  ┌─────────────────┐  │       │  ┌───────────────────────┐  │
│  │ Server compo-   │──┼──RLS──┼─▶│  Postgres (groups,    │  │
│  │ nents + Server  │  │       │  │  trips, matches,      │  │
│  │ Actions         │  │       │  │  messages, pipeline)  │  │
│  └─────────────────┘  │       │  └───────────────────────┘  │
│  ┌─────────────────┐  │       │  ┌───────────────────────┐  │
│  │ Edge middleware │──┼───────┼─▶│  Auth (Google + OTP)  │  │
│  │ (auth gating)   │  │       │  └───────────────────────┘  │
│  └─────────────────┘  │       │  ┌───────────────────────┐  │
│                       │       │  │  Realtime (pipeline)  │  │
│                       │       │  └───────────────────────┘  │
└───────────────────────┘       └─────────────────────────────┘
        │                                    ▲
        ▼                                    │
   Resend (email)                    PostHog / Sentry
```

---

## 3. Database schema

See `supabase/migrations/0001_init.sql` for the runnable version. Highlights:

```sql
-- Identity
profiles            (id ⟂ auth.users, display_name, role: traveler|agent, ...)

-- Core domain
travel_groups       (id, owner_id → profiles, name, home_city, home_state,
                     adults, kids_count, kids_ages int[], experience_level,
                     past_visits, vip_experience, pace, interests text[],
                     bio, mobility_notes, early_riser, park_hopper,
                     budget_comfort, completeness_score, is_published)

trips               (id, group_id → travel_groups, arrival, departure,
                     park_days jsonb,           -- {"2026-05-14":"MK", ...}
                     ideal_vip_days date[], flexible bool,
                     open_seats int, willingness: join|host|either,
                     status: seeking|partial|coordinating|booked,
                     daterange daterange GENERATED)

-- Matching
match_requests      (id, from_trip_id, to_trip_id, message, status, created_at)
matches             (id, trip_a_id, trip_b_id, score numeric,
                     reasons text[], suggested_date date, is_agent_suggested,
                     created_at) UNIQUE(LEAST(a,b), GREATEST(a,b))

-- Comms
messages            (id, match_id, sender_id, body, created_at)

-- Trust
verifications       (profile_id, email_verified, phone_verified, agent_reviewed)
reports             (id, reporter_id, target_profile_id, reason, status)

-- Agent
pipeline_entries    (id, trip_id, stage: new|exploring|matched|coordinating|booked,
                     agent_id, notes, updated_at)
agent_suggestions   (id, agent_id, trip_a_id, trip_b_id, rationale, created_at)
```

### Key indexes
- `trips USING gist (daterange)` — overlap queries in O(log n).
- `travel_groups USING gin (interests)` + `gin (kids_ages)` — set overlap.
- Partial: `WHERE is_published = true` on hot read paths.

### Row-Level Security (sketch)
```sql
-- A traveler sees only their own groups + published groups of others
CREATE POLICY "groups_read"
  ON travel_groups FOR SELECT
  USING ( owner_id = auth.uid() OR is_published = true );

-- Trip details masked until match is accepted
-- (handled by SECURITY DEFINER view `public_trip_card`)

-- Agents bypass via role claim
CREATE POLICY "agent_all"
  ON travel_groups FOR ALL
  USING ( (auth.jwt() ->> 'role') = 'agent' );
```

---

## 4. Page / route map

```
/                                  Marketing landing (public)
/how-it-works                      Public explainer
/login   /signup                   Supabase Auth (Google + email OTP)

/dashboard                         (auth) Traveler home: my group + my trips
/groups/new                        Create travel group
/groups/[id]                       View / edit group
/trips/new                         Create trip plan
/trips/[id]                        Trip detail (owner view)

/discover/calendar                 Calendar heatmap (overlap density)
/discover/matches                  Card list with filters + sort
/discover/groups/[tripId]          Public trip card (limited fields)

/requests                          Inbox: incoming + outgoing match requests
/matches/[id]                      Accepted match: chat + shared details

/account                           Profile, verification, notifications
/account/verify-phone

/agent                             (agent role) Dashboard
/agent/pipeline                    Kanban: new → exploring → matched → coordinating → booked
/agent/groups                      All groups (search + filter)
/agent/suggest                     Build a "suggested VIP group" from N trips
/agent/messages                    Threaded comms across both sides

/api/match/score      POST         Server action wrapper (used by agent suggest)
/api/cron/recompute   GET          Daily recompute of top-N matches per trip
```

---

## 5. UX flows

### Flow A — Traveler onboarding (target: < 4 minutes)

1. Land on `/`, click **Find your VIP group**.
2. Sign in with Google.
3. **Step 1 — Group basics** (1 screen, 6 fields).
4. **Step 2 — Composition** (adults / kids / ages chip picker).
5. **Step 3 — Style** (pace + interests + experience).
6. **Step 4 — Bio** (single textarea, 280 char target, examples shown).
7. **Step 5 — Trip dates** (date range picker + park-per-day grid + open seats).
8. → Land on `/discover/calendar` with their dates pre-highlighted.

### Flow B — Discovery → match request

1. Calendar view shows heatmap; user clicks **May 14** (high density).
2. Match list filters to that date; cards sorted by compatibility score.
3. Click card → **public trip card** (masked: no last name, no contact).
4. Click **Request match** → modal with intro message template.
5. Other side gets email + in-app notification → accepts or declines.
6. On accept: shared chat unlocks + fuller profile reveals.

### Flow C — Agent escalation

1. From an accepted match, either side clicks **Request agent help**.
2. Trip is added to agent pipeline at stage `exploring`.
3. Agent sees both sides, can join the chat, suggest a third group, set the booked date, and mark `booked`.

### Flow D — Agent-suggested match (proactive)

1. Agent opens `/agent/suggest`, picks 2–3 trips with overlapping dates.
2. System auto-computes combined score + open seats + suggested VIP date.
3. Agent clicks **Send suggestion** — both sides get a message tagged `Agent suggested` (trust boost).

---

## 6. Matching algorithm (with weights)

Implemented in `src/lib/matching.ts`. Pure function over two `TripWithGroup` records → `{ score: 0–100, reasons: string[], suggestedDate }`.

### Weights (sum = 100)

| Factor | Weight | Rule |
|---|---:|---|
| **Date overlap** | 35 | `overlapDays / max(myDays, theirDays)` × 35. Zero overlap → score capped at 0 (hard gate). |
| **Group size fit** | 12 | Combined adults ≤ 6 → full; 7–8 → half; >8 → 0. VIP tours cap around 10 guests. |
| **Kid age compatibility** | 18 | For each of my kids, best ±age within their kids. avg(1 − |Δ|/6), clamped. No-kids vs no-kids → full. |
| **Pace match** | 10 | Same → full; one step off (`relaxed↔balanced`) → half; opposite → 0. |
| **Experience level** | 8 | Same → full; one step off → 60%; first-time + frequent → 30% (frequent can mentor — not a deal-breaker). |
| **Interests overlap** | 12 | Jaccard on interest tags × 12. |
| **Flexibility bonus** | 5 | Either side flexible → full; both fixed → 50%. |

### Hard gates (score = 0 regardless)
- No date overlap.
- Combined adults > 8 (won't fit a single VIP guide ratio).
- Either side `status = booked`.
- Either side has reported/blocked the other.

### `suggestedDate`
Among the date-overlap window, prefer (in order): a date in **both** `ideal_vip_days`, then a weekday in either, then the median overlap day.

### Reason strings (for the explanation card)
Generated from the highest-weighted contributing factors, e.g.:
> *"Strong match: 4 overlapping days, similar kid ages (7 & 9 vs 6 & 10), both prefer balanced pace, both targeting Magic Kingdom on May 14."*

See `vibeSummary()` for the auto-generated group blurb.

---

## 7. Admin (travel agent) workflow

The agent is the **conversion layer** — most groups won't book without a human. Dashboard at `/agent`.

**Daily loop:**
1. **Inbox** — new groups, new accepted matches, escalation requests.
2. **Pipeline (Kanban)** — drag trips between `new → exploring → matched → coordinating → booked`. Each card shows trip dates, open seats, compatibility of any current match, last-touch age.
3. **Suggest** — for any date with ≥2 unmatched trips, agent can bundle 2–3 into a "suggested VIP group" and broadcast.
4. **Notes** — private per-trip notes (never visible to travelers).
5. **Booked** — agent records the final park, date, guide, and price-per-family. Closes the loop in analytics.

**Why this matters.** The pipeline IS the business. Marketplace metrics (matches created) lie; pipeline metrics (booked groups, avg time-to-book) tell the truth.

---

## 8. MVP build plan (phased)

### Phase 0 — Foundations (3 days)
- Repo scaffold (this commit).
- Supabase project + migrations + RLS.
- Auth (Google + email OTP).
- Empty dashboard.

### Phase 1 — Profile & trip creation (4 days)
- Group form (multi-step).
- Trip form with date range + park-day grid.
- `vibeSummary` auto-generation.
- Profile completeness score.

### Phase 2 — Discovery (5 days)
- Calendar heatmap (server-aggregated).
- Match list with filters (dates, kids, pace, location).
- Public trip card (masked).
- Matching algorithm (`src/lib/matching.ts`) + nightly cron.

### Phase 3 — Connection (4 days)
- Match request flow + notifications.
- Accepted-match chat (Supabase Realtime).
- Reveal-on-accept gating.

### Phase 4 — Agent dashboard (5 days)
- Pipeline kanban (Realtime).
- Agent-suggested match flow.
- Private notes + booked-state tracking.

### Phase 5 — Trust & polish (3 days)
- Email + phone verification.
- Reporting / blocking.
- Agent-reviewed badge.
- Empty states, loading states, mobile pass.

**MVP launch target: ~24 working days (≈5 weeks for one full-stack engineer).**

---

## 9. Starter code scaffolding

```
.
├── package.json / tsconfig / tailwind / next.config / postcss
├── .env.example
├── supabase/
│   ├── migrations/0001_init.sql        # full schema + RLS + indexes
│   └── seed.sql                        # demo agent + 6 groups + 8 trips
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # font + footer disclaimer
│   │   ├── page.tsx                    # marketing landing
│   │   ├── globals.css
│   │   ├── (auth)/login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── groups/new/page.tsx
│   │   ├── trips/new/page.tsx
│   │   ├── discover/
│   │   │   ├── calendar/page.tsx       # heatmap
│   │   │   └── matches/page.tsx        # card list
│   │   ├── matches/[id]/page.tsx
│   │   ├── requests/page.tsx
│   │   └── agent/
│   │       ├── page.tsx
│   │       └── pipeline/page.tsx
│   ├── components/
│   │   ├── ui/                         # shadcn primitives
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx             # legal disclaimer
│   │   ├── match-card.tsx
│   │   ├── compatibility-meter.tsx
│   │   ├── status-badge.tsx
│   │   ├── calendar-heatmap.tsx
│   │   ├── group-form.tsx
│   │   ├── trip-form.tsx
│   │   └── pipeline-board.tsx
│   └── lib/
│       ├── matching.ts                 # the algorithm
│       ├── vibe.ts                     # auto group summary
│       ├── completeness.ts
│       ├── seed-data.ts                # in-memory demo data
│       ├── types.ts
│       ├── utils.ts
│       └── supabase/{client,server}.ts
└── README.md (this file)
```

### Run locally
```bash
pnpm install
cp .env.example .env.local             # fill Supabase keys
pnpm dev                               # http://localhost:3000
```

The app boots with **in-memory seed data** so you can demo all flows without a Supabase project. Wire real env vars to flip to live data.

---

## 10. Seed data

`src/lib/seed-data.ts` (UI demo) and `supabase/seed.sql` (DB demo) provide:

- **1 travel agent** (`maya@magicvipmatch.test`).
- **6 travel groups** spanning Texas, NY, CA, IL, FL, Ontario — varied family shapes (toddlers, tweens, teens, adults-only).
- **8 trips** in May–July 2026 designed to produce realistic match overlap clusters on **May 12–16** and **June 24–28**.
- **3 pre-existing matches** at varying scores (94, 81, 67) so the UI shows range.
- **2 pipeline entries** in `exploring` and `coordinating` so the agent kanban isn't empty.

---

## 11. Risks and edge cases

| Risk | Mitigation |
|---|---|
| **Brand / legal — Disney IP.** | No Disney logos, fonts, colors, or imagery anywhere. Footer disclaimer on every page. Trademark counsel review pre-launch. |
| **Cold-start liquidity** (no matches without users) | Agent seeds the first 30 days by recruiting groups manually, then uses the suggest tool to manufacture matches. |
| **Two-sided trust** (sharing tour with strangers) | Reveal-on-accept, agent-reviewed badge, phone verification, reporting, and the agent-as-facilitator path. |
| **Date overlap with no compatibility** | Soft fallback: show closest matches even at score < 50 with explicit "low match" badge. |
| **Group ghosting after accept** | Auto-decay: trips with no activity in 14 days get `seeking` reset and a re-engagement email. |
| **Money handling** | MVP: agent collects payment off-platform (Zelle / agent's existing booking system). Phase 2: Stripe Connect with escrow. |
| **Park rules change** (VIP cap, age policy) | All park-specific rules live in a single `park_rules.json` editable without deploy. |
| **Underage organizers** | Self-attestation 18+ at signup; ToS gate. |
| **PII leakage in chat** | Realtime channel scoped per `match_id`; RLS on `messages`; no contact-info auto-share before booked. |
| **Spam / fake groups** | Email verification required to publish; rate-limit match requests; agent-flag dashboard. |

---

## 12. Future roadmap

**Q+1 — Trust & monetization**
- Stripe Connect: per-seat pre-auth, charged on `booked`.
- ID verification (Stripe Identity).
- Agent marketplace: multiple vetted agents, ratings.

**Q+2 — Inventory side**
- Direct integrations with VIP guide companies (where allowed by park ToU).
- "Open VIP slots" feed: agents post available guide-days, families slot in.

**Q+3 — Expansion**
- Universal, SeaWorld, international parks (Tokyo, Paris, Shanghai).
- Cruise-line group coordination (similar share-the-cabin-extra dynamics).
- Sports / concert VIP boxes.

**Q+4 — Intelligence**
- LLM-generated trip itineraries from matched-group preferences.
- Predictive open-seat alerts ("3 families like yours are searching May 14 — publish now?").
- Compatibility model retrained on `booked` outcomes.

---

### Legal

Magic VIP Match is an independent platform and is not affiliated with or endorsed by The Walt Disney Company. All park names are used descriptively to indicate venue location only.
