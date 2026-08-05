-- Better display names for Google and email sign-ups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_name text;
begin
  resolved_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Utilisateur Soko'
  );

  insert into public.profiles (id, display_name, verification_level)
  values (
    new.id,
    resolved_name,
    case
      when new.phone is not null then 'phone'::public.verification_level
      else 'none'::public.verification_level
    end
  );
  return new;
end;
$$;
