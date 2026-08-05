-- Soko initial schema: profiles, taxonomy, listings, chat, trust
-- Phone numbers live in auth.users only — never exposed via public profile selects.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.verification_level as enum (
  'none',
  'phone',
  'id_pending',
  'verified'
);

create type public.listing_status as enum (
  'draft',
  'active',
  'reserved',
  'sold',
  'archived'
);

create type public.listing_verification_status as enum (
  'unverified',
  'pending',
  'verified',
  'rejected'
);

create type public.currency_code as enum ('USD', 'CDF');

create type public.seller_verification_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type public.report_status as enum (
  'open',
  'reviewed',
  'actioned',
  'dismissed'
);

-- ---------------------------------------------------------------------------
-- Profiles (no phone column — phone stays in auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  verification_level public.verification_level not null default 'none',
  is_seller boolean not null default false,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, verification_level)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Utilisateur Soko'),
    case when new.phone is not null then 'phone'::public.verification_level else 'none'::public.verification_level end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Seller ID verification
-- ---------------------------------------------------------------------------
create table public.seller_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  id_document_path text,
  selfie_path text,
  status public.seller_verification_status not null default 'pending',
  reviewer_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- Taxonomy
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_fr text not null,
  icon text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  slug text not null,
  name_fr text not null,
  sort_order int not null default 0,
  unique (category_id, slug)
);

-- ---------------------------------------------------------------------------
-- Kinshasa locations
-- ---------------------------------------------------------------------------
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  commune text not null,
  quartier text,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index locations_commune_idx on public.locations (commune);

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id),
  subcategory_id uuid references public.subcategories (id),
  location_id uuid references public.locations (id),
  title text not null,
  description text not null default '',
  price numeric(14, 2) not null check (price >= 0),
  currency public.currency_code not null default 'USD',
  negociable boolean not null default false,
  status public.listing_status not null default 'draft',
  verification_status public.listing_verification_status not null default 'unverified',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index listings_status_idx on public.listings (status);
create index listings_category_idx on public.listings (category_id);
create index listings_location_idx on public.listings (location_id);
create index listings_seller_idx on public.listings (seller_id);
create index listings_feed_idx on public.listings (status, published_at desc);

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create table public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  is_cover boolean not null default false,
  authenticity_flag text,
  created_at timestamptz not null default now()
);

create index listing_media_listing_idx on public.listing_media (listing_id, sort_order);

-- ---------------------------------------------------------------------------
-- Favorites
-- ---------------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- ---------------------------------------------------------------------------
-- Chat (in-app only)
-- ---------------------------------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create index conversations_buyer_idx on public.conversations (buyer_id, last_message_at desc);
create index conversations_seller_idx on public.conversations (seller_id, last_message_at desc);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) > 0 and char_length(body) <= 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
after insert on public.messages
for each row execute function public.touch_conversation_on_message();

-- ---------------------------------------------------------------------------
-- Trust / safety
-- ---------------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_user_id uuid references public.profiles (id) on delete set null,
  listing_id uuid references public.listings (id) on delete set null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now()
);

create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('listing-media', 'listing-media', true),
  ('verification-docs', 'verification-docs', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.seller_verifications enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.locations enable row level security;
alter table public.listings enable row level security;
alter table public.listing_media enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

-- Profiles: public can read identity fields; users update own
create policy "profiles_select_public"
on public.profiles for select
using (true);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Seller verifications: own only
create policy "seller_verifications_select_own"
on public.seller_verifications for select
to authenticated
using (auth.uid() = user_id);

create policy "seller_verifications_insert_own"
on public.seller_verifications for insert
to authenticated
with check (auth.uid() = user_id);

create policy "seller_verifications_update_own"
on public.seller_verifications for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Taxonomy + locations: public read
create policy "categories_select_all"
on public.categories for select using (true);

create policy "subcategories_select_all"
on public.subcategories for select using (true);

create policy "locations_select_all"
on public.locations for select using (true);

-- Listings: public read active; sellers manage own
create policy "listings_select_public_or_own"
on public.listings for select
using (
  status = 'active'
  or auth.uid() = seller_id
);

create policy "listings_insert_own"
on public.listings for insert
to authenticated
with check (auth.uid() = seller_id);

create policy "listings_update_own"
on public.listings for update
to authenticated
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

create policy "listings_delete_own"
on public.listings for delete
to authenticated
using (auth.uid() = seller_id);

-- Listing media follows listing visibility
create policy "listing_media_select"
on public.listing_media for select
using (
  exists (
    select 1 from public.listings l
    where l.id = listing_id
      and (l.status = 'active' or l.seller_id = auth.uid())
  )
);

create policy "listing_media_insert_own"
on public.listing_media for insert
to authenticated
with check (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.seller_id = auth.uid()
  )
);

create policy "listing_media_update_own"
on public.listing_media for update
to authenticated
using (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.seller_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.seller_id = auth.uid()
  )
);

create policy "listing_media_delete_own"
on public.listing_media for delete
to authenticated
using (
  exists (
    select 1 from public.listings l
    where l.id = listing_id and l.seller_id = auth.uid()
  )
);

-- Favorites
create policy "favorites_select_own"
on public.favorites for select
to authenticated
using (auth.uid() = user_id);

create policy "favorites_insert_own"
on public.favorites for insert
to authenticated
with check (auth.uid() = user_id);

create policy "favorites_delete_own"
on public.favorites for delete
to authenticated
using (auth.uid() = user_id);

-- Conversations: participants only
create policy "conversations_select_participants"
on public.conversations for select
to authenticated
using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "conversations_insert_buyer"
on public.conversations for insert
to authenticated
with check (
  auth.uid() = buyer_id
  and buyer_id <> seller_id
  and exists (
    select 1 from public.listings l
    where l.id = listing_id and l.seller_id = seller_id and l.status = 'active'
  )
);

-- Messages: participants only
create policy "messages_select_participants"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

create policy "messages_insert_participants"
on public.messages for insert
to authenticated
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

create policy "messages_update_read_participants"
on public.messages for update
to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
)
with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

-- Reports / blocks
create policy "reports_insert_own"
on public.reports for insert
to authenticated
with check (auth.uid() = reporter_id);

create policy "reports_select_own"
on public.reports for select
to authenticated
using (auth.uid() = reporter_id);

create policy "blocks_select_own"
on public.blocks for select
to authenticated
using (auth.uid() = blocker_id);

create policy "blocks_insert_own"
on public.blocks for insert
to authenticated
with check (auth.uid() = blocker_id);

create policy "blocks_delete_own"
on public.blocks for delete
to authenticated
using (auth.uid() = blocker_id);

-- Storage policies
create policy "listing_media_public_read"
on storage.objects for select
using (bucket_id = 'listing-media');

create policy "listing_media_auth_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "listing_media_auth_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'listing-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'listing-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "listing_media_auth_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "verification_docs_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'verification-docs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "verification_docs_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'verification-docs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- ---------------------------------------------------------------------------
-- Seeds: categories + Kinshasa communes / quartiers
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name_fr, icon, sort_order, is_featured) values
  ('telephones-electronique', 'Téléphones & électronique', 'phone', 1, true),
  ('vehicules-motos', 'Véhicules & motos', 'car', 2, true),
  ('immobilier', 'Immobilier', 'home', 3, true),
  ('mode-beaute', 'Mode & beauté', 'shirt', 4, false),
  ('maison-jardin', 'Maison & jardin', 'sofa', 5, false),
  ('emplois', 'Emplois', 'briefcase', 6, false),
  ('services', 'Services', 'wrench', 7, false),
  ('autres', 'Autres', 'grid', 8, false);

insert into public.subcategories (category_id, slug, name_fr, sort_order)
select c.id, s.slug, s.name_fr, s.sort_order
from public.categories c
join (
  values
    ('telephones-electronique', 'smartphones', 'Smartphones', 1),
    ('telephones-electronique', 'laptops', 'Ordinateurs', 2),
    ('telephones-electronique', 'accessoires', 'Accessoires', 3),
    ('vehicules-motos', 'voitures', 'Voitures', 1),
    ('vehicules-motos', 'motos', 'Motos', 2),
    ('vehicules-motos', 'pieces', 'Pièces', 3),
    ('immobilier', 'location', 'Location', 1),
    ('immobilier', 'vente', 'Vente', 2),
    ('immobilier', 'terrains', 'Terrains', 3)
) as s(cat_slug, slug, name_fr, sort_order)
  on c.slug = s.cat_slug;

insert into public.locations (commune, quartier, slug, sort_order) values
  ('Gombe', null, 'gombe', 1),
  ('Gombe', 'Centre-ville', 'gombe-centre-ville', 2),
  ('Kinshasa', null, 'kinshasa-commune', 3),
  ('Lingwala', null, 'lingwala', 4),
  ('Barumbu', null, 'barumbu', 5),
  ('Kintambo', null, 'kintambo', 6),
  ('Ngaliema', null, 'ngaliema', 7),
  ('Ngaliema', 'Ma Campagne', 'ngaliema-ma-campagne', 8),
  ('Ngaliema', 'Binza', 'ngaliema-binza', 9),
  ('Bandalungwa', null, 'bandalungwa', 10),
  ('Kalamu', null, 'kalamu', 11),
  ('Kalamu', 'Matonge', 'kalamu-matonge', 12),
  ('Limete', null, 'limete', 13),
  ('Limete', 'Kingabwa', 'limete-kingabwa', 14),
  ('Masina', null, 'masina', 15),
  ('N''djili', null, 'ndjili', 16),
  ('Kimbanseke', null, 'kimbanseke', 17),
  ('Nsele', null, 'nsele', 18),
  ('Mont-Ngafula', null, 'mont-ngafula', 19),
  ('Lemba', null, 'lemba', 20),
  ('Ngaba', null, 'ngaba', 21),
  ('Makala', null, 'makala', 22),
  ('Selembao', null, 'selembao', 23),
  ('Bumbu', null, 'bumbu', 24),
  ('Kisenso', null, 'kisenso', 25);
