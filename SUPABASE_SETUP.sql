-- ══════════════════════════════════════════════════════════════
-- SAMPLEFLOW MS — Supabase Database Setup
-- Run this entire file in Supabase SQL Editor
-- Go to: https://supabase.com → Your Project → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════

-- 1. SAMPLES TABLE
create table if not exists public.samples (
  id            uuid default gen_random_uuid() primary key,
  sample_id     text not null unique,
  buyer         text not null,
  brand         text,
  sample_type   text not null default 'PP Sample',
  garment_type  text not null default 'Bottom',
  stage         text not null default 'CAD',
  notes         text,
  created_by    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. ACTIVITY LOG TABLE
create table if not exists public.activity_log (
  id          uuid default gen_random_uuid() primary key,
  sample_id   uuid references public.samples(id) on delete cascade,
  message     text not null,
  from_stage  text,
  to_stage    text,
  done_by     text,
  created_at  timestamptz default now()
);

-- 3. ROW LEVEL SECURITY (allow authenticated users to read/write)
alter table public.samples     enable row level security;
alter table public.activity_log enable row level security;

create policy "Authenticated users can read samples"
  on public.samples for select to authenticated using (true);

create policy "Authenticated users can insert samples"
  on public.samples for insert to authenticated with check (true);

create policy "Authenticated users can update samples"
  on public.samples for update to authenticated using (true);

create policy "Authenticated users can delete samples"
  on public.samples for delete to authenticated using (true);

create policy "Authenticated users can read activity"
  on public.activity_log for select to authenticated using (true);

create policy "Authenticated users can insert activity"
  on public.activity_log for insert to authenticated with check (true);

-- 4. SAMPLE DATA (optional — for testing)
insert into public.samples (sample_id, buyer, brand, sample_type, garment_type, stage, notes)
values
  ('40139464', 'Myntra',   'Roadster', 'PP Sample',       'Bottom', 'CAD',       ''),
  ('40139463', 'Myntra',   'Roadster', 'PP Sample',       'Bottom', 'CAD',       ''),
  ('40139460', 'Flipkart', 'Avaasa',   'Proto Sample',    'Top',    'Cutting',   'Striped cotton'),
  ('40139458', 'H&M',      'Divided',  'Fit Sample',      'Dress',  'Stitching', 'Floral print'),
  ('40139455', 'Zara',     'Zara',     'Size Set',        'Jacket', 'Washing',   'Enzyme wash'),
  ('40139450', 'M&S',      'M&S',      'TOP Sample',      'Shirt',  'QC',        'Final check pending'),
  ('40139445', 'Gap',      'Gap',      'Salesman Sample', 'Bottom', 'Shipped',   'Dispatched via DHL')
on conflict (sample_id) do nothing;

-- ══════════════════════════════════════════════════════════════
-- AFTER RUNNING THIS SQL:
-- Go to Supabase → Authentication → Users → Invite User
-- Add each email below with a password:
--   cad.gmts@aaatextiles.in
--   qc@aaatextiles.in
--   prabhu.aaatextiles@gmail.com
--   merchant1@aaatextiles.in
--   merchant2@aaatextiles.in
--   merchant3@aaatextiles.in
--   merchant@aaatextiles.in
--   murugesh.k@aaatextiles.in
-- ══════════════════════════════════════════════════════════════
