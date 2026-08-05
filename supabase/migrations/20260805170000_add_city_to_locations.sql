-- Expand locations beyond Kinshasa communes to cities across RDC
alter table public.locations
  add column if not exists city text;

update public.locations
set city = 'Kinshasa'
where city is null;

alter table public.locations
  alter column city set not null,
  alter column city set default 'Kinshasa';

create index if not exists locations_city_idx on public.locations (city);

-- Major cities outside Kinshasa
insert into public.locations (city, commune, quartier, slug, sort_order) values
  ('Lubumbashi', 'Lubumbashi', null, 'lubumbashi', 100),
  ('Goma', 'Goma', null, 'goma', 101),
  ('Bukavu', 'Bukavu', null, 'bukavu', 102),
  ('Kisangani', 'Kisangani', null, 'kisangani', 103),
  ('Mbuji-Mayi', 'Mbuji-Mayi', null, 'mbuji-mayi', 104),
  ('Kananga', 'Kananga', null, 'kananga', 105),
  ('Matadi', 'Matadi', null, 'matadi', 106),
  ('Kolwezi', 'Kolwezi', null, 'kolwezi', 107),
  ('Kindu', 'Kindu', null, 'kindu', 108),
  ('Bunia', 'Bunia', null, 'bunia', 109),
  ('Kikwit', 'Kikwit', null, 'kikwit', 110),
  ('Tshikapa', 'Tshikapa', null, 'tshikapa', 111),
  ('Uvira', 'Uvira', null, 'uvira', 112),
  ('Beni', 'Beni', null, 'beni', 113),
  ('Butembo', 'Butembo', null, 'butembo', 114)
on conflict (slug) do nothing;
