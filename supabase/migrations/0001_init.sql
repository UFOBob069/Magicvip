-- Magic VIP Match — initial schema
-- Postgres 15+. Run via `supabase db push` or psql.

create extension if not exists btree_gist;

-- ──────────────────────────────────────────────────────────
-- Enums
-- ──────────────────────────────────────────────────────────
create type user_role          as enum ('traveler', 'agent');
create type experience_level   as enum ('first_time', 'few_times', 'frequent');
create type pace_pref          as enum ('relaxed', 'balanced', 'maximize');
create type willingness_pref   as enum ('join', 'host', 'either');
create type trip_status        as enum ('seeking', 'partial', 'coordinating', 'booked');
create type pipeline_stage     as enum ('new', 'exploring', 'matched', 'coordinating', 'booked');
create type request_status     as enum ('pending', 'accepted', 'declined', 'withdrawn');
create type budget_comfort     as enum ('value', 'mid', 'premium');

-- ──────────────────────────────────────────────────────────
-- Profiles (1:1 with auth.users)
-- ──────────────────────────────────────────────────────────
create table profiles (
  id              uuid primary key references auth.users on delete cascade,
  display_name    text not null,
  role            user_role not null default 'traveler',
  avatar_url      text,
  created_at      timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────
-- Travel groups
-- ──────────────────────────────────────────────────────────
create table travel_groups (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references profiles(id) on delete cascade,
  name                text not null,
  organizer_first     text not null,
  home_city           text not null,
  home_state          text not null,
  adults              int  not null check (adults between 1 and 10),
  kids_count          int  not null default 0 check (kids_count between 0 and 10),
  kids_ages           int[] not null default '{}',
  experience_level    experience_level not null,
  past_visits         int  not null default 0,
  vip_experience      bool not null default false,
  pace                pace_pref not null,
  interests           text[] not null default '{}',
  bio                 text not null,
  mobility_notes      text,
  early_riser         bool,
  park_hopper         bool,
  budget_comfort      budget_comfort,
  completeness_score  int  not null default 0,
  is_published        bool not null default false,
  created_at          timestamptz not null default now()
);

create index travel_groups_interests_idx on travel_groups using gin (interests);
create index travel_groups_kids_ages_idx on travel_groups using gin (kids_ages);
create index travel_groups_published_idx on travel_groups (is_published) where is_published;

-- ──────────────────────────────────────────────────────────
-- Trips
-- ──────────────────────────────────────────────────────────
create table trips (
  id              uuid primary key default gen_random_uuid(),
  group_id        uuid not null references travel_groups(id) on delete cascade,
  arrival         date not null,
  departure       date not null check (departure >= arrival),
  park_days       jsonb not null default '{}'::jsonb,  -- {"2026-05-14":"MK", ...}
  ideal_vip_days  date[] not null default '{}',
  flexible        bool not null default false,
  open_seats      int  not null default 0 check (open_seats between 0 and 8),
  willingness     willingness_pref not null default 'either',
  status          trip_status not null default 'seeking',
  daterange       daterange generated always as
                     (daterange(arrival, departure, '[]')) stored,
  created_at      timestamptz not null default now()
);

create index trips_daterange_idx on trips using gist (daterange);
create index trips_status_idx    on trips (status);

-- ──────────────────────────────────────────────────────────
-- Match requests + persisted matches
-- ──────────────────────────────────────────────────────────
create table match_requests (
  id           uuid primary key default gen_random_uuid(),
  from_trip_id uuid not null references trips(id) on delete cascade,
  to_trip_id   uuid not null references trips(id) on delete cascade,
  message      text not null,
  status       request_status not null default 'pending',
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  unique (from_trip_id, to_trip_id)
);

create table matches (
  id                  uuid primary key default gen_random_uuid(),
  trip_a_id           uuid not null references trips(id) on delete cascade,
  trip_b_id           uuid not null references trips(id) on delete cascade,
  score               numeric(5,2) not null,
  reasons             text[] not null default '{}',
  suggested_date      date,
  is_agent_suggested  bool not null default false,
  created_at          timestamptz not null default now(),
  -- canonical ordering so (a,b) and (b,a) collapse
  pair_lo             uuid generated always as (least(trip_a_id, trip_b_id)) stored,
  pair_hi             uuid generated always as (greatest(trip_a_id, trip_b_id)) stored,
  unique (pair_lo, pair_hi)
);

-- ──────────────────────────────────────────────────────────
-- Messages (per accepted match)
-- ──────────────────────────────────────────────────────────
create table messages (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references matches(id) on delete cascade,
  sender_id   uuid not null references profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index messages_match_idx on messages (match_id, created_at);

-- ──────────────────────────────────────────────────────────
-- Trust
-- ──────────────────────────────────────────────────────────
create table verifications (
  profile_id        uuid primary key references profiles(id) on delete cascade,
  email_verified    bool not null default false,
  phone_verified    bool not null default false,
  agent_reviewed    bool not null default false,
  updated_at        timestamptz not null default now()
);

create table reports (
  id                 uuid primary key default gen_random_uuid(),
  reporter_id        uuid not null references profiles(id),
  target_profile_id  uuid not null references profiles(id),
  reason             text not null,
  status             text not null default 'open',
  created_at         timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────
-- Agent pipeline + suggestions
-- ──────────────────────────────────────────────────────────
create table pipeline_entries (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references trips(id) on delete cascade,
  stage       pipeline_stage not null default 'new',
  agent_id    uuid references profiles(id),
  notes       text,
  updated_at  timestamptz not null default now(),
  unique (trip_id)
);

create table agent_suggestions (
  id           uuid primary key default gen_random_uuid(),
  agent_id     uuid not null references profiles(id),
  trip_a_id    uuid not null references trips(id) on delete cascade,
  trip_b_id    uuid not null references trips(id) on delete cascade,
  trip_c_id    uuid references trips(id) on delete cascade,
  rationale    text not null,
  created_at   timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────
-- Row-Level Security (sketch — tighten before prod)
-- ──────────────────────────────────────────────────────────
alter table profiles         enable row level security;
alter table travel_groups    enable row level security;
alter table trips            enable row level security;
alter table match_requests   enable row level security;
alter table matches          enable row level security;
alter table messages         enable row level security;
alter table verifications    enable row level security;
alter table reports          enable row level security;
alter table pipeline_entries enable row level security;
alter table agent_suggestions enable row level security;

-- profiles
create policy "profiles_self_read"
  on profiles for select using ( id = auth.uid() or true ); -- display_name is public

create policy "profiles_self_update"
  on profiles for update using ( id = auth.uid() );

-- travel groups: own + published
create policy "groups_read"
  on travel_groups for select
  using ( owner_id = auth.uid() or is_published = true );

create policy "groups_owner_write"
  on travel_groups for all
  using ( owner_id = auth.uid() ) with check ( owner_id = auth.uid() );

-- trips: own + (published group)
create policy "trips_read"
  on trips for select
  using (
    exists (
      select 1 from travel_groups g
      where g.id = trips.group_id
        and (g.owner_id = auth.uid() or g.is_published = true)
    )
  );

create policy "trips_owner_write"
  on trips for all
  using (
    exists (select 1 from travel_groups g
            where g.id = trips.group_id and g.owner_id = auth.uid())
  );

-- messages: only participants
create policy "messages_participants"
  on messages for select
  using (
    exists (
      select 1 from matches m
        join trips ta on ta.id = m.trip_a_id
        join trips tb on tb.id = m.trip_b_id
        join travel_groups ga on ga.id = ta.group_id
        join travel_groups gb on gb.id = tb.group_id
      where m.id = messages.match_id
        and (ga.owner_id = auth.uid() or gb.owner_id = auth.uid())
    )
  );

-- agent override
create policy "agent_groups_all"
  on travel_groups for all
  using ( (auth.jwt() ->> 'role') = 'agent' );

create policy "agent_trips_all"
  on trips for all
  using ( (auth.jwt() ->> 'role') = 'agent' );

create policy "agent_pipeline_all"
  on pipeline_entries for all
  using ( (auth.jwt() ->> 'role') = 'agent' );
