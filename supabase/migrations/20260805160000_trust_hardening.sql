-- Trust hardening: prevent client escalation of verification fields
-- Realtime publication for chat

-- Profiles: users may only update safe columns
create or replace function public.protect_profile_trust_fields()
returns trigger
language plpgsql
as $$
begin
  if new.verification_level is distinct from old.verification_level then
    new.verification_level := old.verification_level;
  end if;
  if new.is_seller is distinct from old.is_seller then
    if not (old.is_seller = false and new.is_seller = true) then
      new.is_seller := old.is_seller;
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_trust_fields
before update on public.profiles
for each row execute function public.protect_profile_trust_fields();

-- Seller verifications: users cannot self-approve or change reviewer fields
create or replace function public.protect_seller_verification_status()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    new.status := old.status;
    new.reviewer_notes := old.reviewer_notes;
    new.reviewed_at := old.reviewed_at;
    -- allow updating document paths while pending
    if old.status <> 'pending' then
      new.id_document_path := old.id_document_path;
      new.selfie_path := old.selfie_path;
    end if;
  end if;
  if tg_op = 'INSERT' then
    new.status := 'pending';
    new.reviewer_notes := null;
    new.reviewed_at := null;
  end if;
  return new;
end;
$$;

create trigger seller_verifications_protect_status
before insert or update on public.seller_verifications
for each row execute function public.protect_seller_verification_status();

-- On insert, set profile to id_pending
create or replace function public.on_seller_verification_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set verification_level = 'id_pending'
  where id = new.user_id
    and verification_level in ('none', 'phone');
  return new;
end;
$$;

create trigger seller_verification_submitted
after insert on public.seller_verifications
for each row execute function public.on_seller_verification_submitted();

-- Messages: participants may only update read_at
create or replace function public.protect_message_columns()
returns trigger
language plpgsql
as $$
begin
  new.id := old.id;
  new.conversation_id := old.conversation_id;
  new.sender_id := old.sender_id;
  new.body := old.body;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger messages_protect_columns
before update on public.messages
for each row execute function public.protect_message_columns();

-- Listings: sellers cannot self-set verified listing status
create or replace function public.protect_listing_verification()
returns trigger
language plpgsql
as $$
begin
  if new.verification_status is distinct from old.verification_status
     and new.verification_status = 'verified' then
    new.verification_status := old.verification_status;
  end if;
  if new.is_featured is distinct from old.is_featured then
    new.is_featured := old.is_featured;
  end if;
  return new;
end;
$$;

create trigger listings_protect_verification
before update on public.listings
for each row execute function public.protect_listing_verification();

-- Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;

-- Mark profile as seller when first listing is created
create or replace function public.mark_seller_on_listing()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set is_seller = true
  where id = new.seller_id and is_seller = false;
  return new;
end;
$$;

create trigger listings_mark_seller
after insert on public.listings
for each row execute function public.mark_seller_on_listing();
