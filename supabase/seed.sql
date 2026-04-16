-- Demo seed: 1 agent, 6 groups, 8 trips, 3 matches, 2 pipeline entries.
-- Assumes auth.users rows exist with the UUIDs below (or run after manual signup).

insert into profiles (id, display_name, role) values
  ('00000000-0000-0000-0000-00000000a001', 'Maya Alvarez',  'agent'),
  ('00000000-0000-0000-0000-00000000b001', 'Sarah K.',      'traveler'),
  ('00000000-0000-0000-0000-00000000b002', 'Marcus T.',     'traveler'),
  ('00000000-0000-0000-0000-00000000b003', 'Priya R.',      'traveler'),
  ('00000000-0000-0000-0000-00000000b004', 'Jenna L.',      'traveler'),
  ('00000000-0000-0000-0000-00000000b005', 'Devin & Kate',  'traveler'),
  ('00000000-0000-0000-0000-00000000b006', 'Rashid F.',     'traveler')
on conflict do nothing;

insert into travel_groups
  (id, owner_id, name, organizer_first, home_city, home_state, adults, kids_count, kids_ages,
   experience_level, past_visits, vip_experience, pace, interests, bio, is_published, completeness_score)
values
  ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000b001',
   'The Kim Family',     'Sarah',  'Austin',     'TX', 2, 2, '{7,9}',
   'few_times', 3, false, 'balanced',
   '{"rides","food","characters"}',
   'Easygoing TX family — kids love dark rides and Mickey waffles. Open to teaming up.',
   true, 92),

  ('11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000b002',
   'Team Tatum',         'Marcus', 'Brooklyn',   'NY', 2, 1, '{8}',
   'first_time', 0, false, 'balanced',
   '{"rides","characters","food"}',
   'First trip ever, son turning 9. Want a guide so we don''t waste a minute.',
   true, 88),

  ('11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000b003',
   'Raj-Patel Crew',     'Priya',  'San Jose',   'CA', 2, 2, '{6,10}',
   'frequent', 7, true, 'maximize',
   '{"thrill","star_wars","rides"}',
   'AP holders, mostly chasing Galaxy''s Edge. Love a packed day.',
   true, 95),

  ('11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-00000000b004',
   'The Lopez Twins',    'Jenna',  'Chicago',    'IL', 2, 2, '{7,7}',
   'few_times', 2, false, 'relaxed',
   '{"food","characters"}',
   'Twin 7yo girls. Pace it slow, lots of snack breaks, character dinners.',
   true, 90),

  ('11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-00000000b005',
   'Devin & Kate',       'Devin',  'Orlando',    'FL', 2, 0, '{}',
   'frequent', 12, true, 'maximize',
   '{"thrill","star_wars","rides","food"}',
   'Locals, no kids. Looking to fill a VIP day with another adult/teen group.',
   true, 96),

  ('11111111-0000-0000-0000-000000000006', '00000000-0000-0000-0000-00000000b006',
   'Farouk Family',      'Rashid', 'Toronto',    'ON', 2, 3, '{5,8,11}',
   'few_times', 2, false, 'balanced',
   '{"rides","food","mixed"}',
   'Three kids spread out in age. Hoping a VIP day keeps everyone happy.',
   true, 85);

insert into trips
  (id, group_id, arrival, departure, ideal_vip_days, flexible, open_seats, willingness, status, park_days)
values
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001',
   '2026-05-12', '2026-05-17', '{2026-05-14}', true,  3, 'either', 'seeking',
   '{"2026-05-13":"EPCOT","2026-05-14":"MK","2026-05-15":"HS"}'),

  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002',
   '2026-05-13', '2026-05-18', '{2026-05-14,2026-05-15}', true, 4, 'join', 'seeking',
   '{"2026-05-14":"MK","2026-05-15":"HS","2026-05-16":"AK"}'),

  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003',
   '2026-05-12', '2026-05-16', '{2026-05-14}', false, 2, 'host', 'seeking',
   '{"2026-05-14":"HS","2026-05-15":"HS"}'),

  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004',
   '2026-06-23', '2026-06-29', '{2026-06-25}', true,  2, 'either', 'partial',
   '{"2026-06-24":"MK","2026-06-25":"MK","2026-06-26":"EPCOT"}'),

  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005',
   '2026-06-24', '2026-06-28', '{2026-06-25,2026-06-26}', true, 6, 'host', 'seeking',
   '{"2026-06-25":"HS","2026-06-26":"MK"}'),

  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000006',
   '2026-06-22', '2026-06-29', '{2026-06-25}', true, 1, 'join', 'seeking',
   '{"2026-06-24":"AK","2026-06-25":"MK","2026-06-26":"EPCOT"}'),

  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000001',
   '2026-07-08', '2026-07-13', '{2026-07-10}', false, 4, 'host', 'seeking',
   '{"2026-07-09":"MK","2026-07-10":"MK"}'),

  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000002',
   '2026-07-09', '2026-07-14', '{2026-07-10}', true,  3, 'join', 'seeking',
   '{"2026-07-10":"MK","2026-07-11":"AK"}');

insert into matches (trip_a_id, trip_b_id, score, reasons, suggested_date, is_agent_suggested) values
  ('22222222-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002',
   94, '{"4 overlapping days","kids 7,9 vs 8 — close ages","both balanced pace","both targeting Magic Kingdom 5/14"}',
   '2026-05-14', true),
  ('22222222-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000005',
   81, '{"3 overlapping days","both flexible","host + either willingness"}',
   '2026-06-25', false),
  ('22222222-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000008',
   67, '{"shared MK on 7/10","group sizes fit","pace one step off"}',
   '2026-07-10', false);

insert into pipeline_entries (trip_id, stage, agent_id, notes) values
  ('22222222-0000-0000-0000-000000000001', 'exploring',    '00000000-0000-0000-0000-00000000a001', 'Sarah is high-intent. Wants confirmation by 4/30.'),
  ('22222222-0000-0000-0000-000000000004', 'coordinating', '00000000-0000-0000-0000-00000000a001', 'Waiting on Devin to confirm guide preference.');
