create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  category text not null check (category in ('restaurant', 'clinic', 'salon', 'gym', 'other')),
  created_at timestamptz not null default now()
);

create table if not exists public.brand_voices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  signature text not null default '',
  use_phrases text[] not null default '{}',
  avoid_phrases text[] not null default '{}',
  sample_reply text not null default '',
  contact_method text not null default 'contact us directly',
  updated_at timestamptz not null default now()
);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  review_text text not null check (char_length(review_text) between 1 and 1500),
  rating integer not null check (rating between 1 and 5),
  tone text not null check (tone in ('warm', 'formal', 'short')),
  drafts jsonb not null check (jsonb_typeof(drafts) = 'array' and jsonb_array_length(drafts) = 3),
  chosen_draft text,
  created_at timestamptz not null default now()
);

create index if not exists replies_business_created_idx on public.replies (business_id, created_at desc);

alter table public.businesses enable row level security;
alter table public.brand_voices enable row level security;
alter table public.replies enable row level security;

create policy "businesses_owner_all" on public.businesses
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "brand_voices_business_owner_all" on public.brand_voices
  for all to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));

create policy "replies_business_owner_all" on public.replies
  for all to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));

grant select, insert, update, delete on public.businesses, public.brand_voices, public.replies to authenticated;
