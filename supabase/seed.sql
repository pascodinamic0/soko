-- Soko demo seed: sellers, buyers, listings, chat, favorites
-- Safe to re-run (skips if demo marker listing exists)

do $$
declare
  inst uuid := '00000000-0000-0000-0000-000000000000';
  seller1 uuid := 'a1111111-1111-4111-8111-111111111111';
  seller2 uuid := 'a2222222-2222-4222-8222-222222222222';
  seller3 uuid := 'a5555555-5555-4555-8555-555555555555';
  buyer1 uuid := 'a3333333-3333-4333-8333-333333333333';
  buyer2 uuid := 'a4444444-4444-4444-8444-444444444444';
  cat_phones uuid;
  cat_vehicles uuid;
  cat_immo uuid;
  cat_mode uuid;
  cat_maison uuid;
  sub_smart uuid;
  sub_laptop uuid;
  sub_voiture uuid;
  sub_moto uuid;
  sub_location uuid;
  sub_vente uuid;
  loc_gombe uuid;
  loc_ngaliema uuid;
  loc_limete uuid;
  loc_kalamu uuid;
  loc_binza uuid;
  conv1 uuid := 'c1111111-1111-4111-8111-111111111111';
  conv2 uuid := 'c2222222-2222-4222-8222-222222222222';
  conv3 uuid := 'c3333333-3333-4333-8333-333333333333';
begin
  if exists (select 1 from public.listings where title = 'iPhone 14 Pro Max 256 Go') then
    raise notice 'Demo seed already applied — skipping';
    return;
  end if;

  -- Demo auth users (phone-only)
  insert into auth.users (
    id, instance_id, aud, role, phone, phone_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
  ) values
    (seller1, inst, 'authenticated', 'authenticated', '+243812000001', now(),
     '{"provider":"phone","providers":["phone"]}'::jsonb, '{"display_name":"Marie K."}'::jsonb, now(), now(), '', '', '', ''),
    (seller2, inst, 'authenticated', 'authenticated', '+243812000002', now(),
     '{"provider":"phone","providers":["phone"]}'::jsonb, '{"display_name":"Jean-Paul M."}'::jsonb, now(), now(), '', '', '', ''),
    (seller3, inst, 'authenticated', 'authenticated', '+243812000003', now(),
     '{"provider":"phone","providers":["phone"]}'::jsonb, '{"display_name":"Grace T."}'::jsonb, now(), now(), '', '', '', ''),
    (buyer1, inst, 'authenticated', 'authenticated', '+243813000001', now(),
     '{"provider":"phone","providers":["phone"]}'::jsonb, '{"display_name":"Patrick N."}'::jsonb, now(), now(), '', '', '', ''),
    (buyer2, inst, 'authenticated', 'authenticated', '+243813000002', now(),
     '{"provider":"phone","providers":["phone"]}'::jsonb, '{"display_name":"Amina B."}'::jsonb, now(), now(), '', '', '', '')
  on conflict (id) do nothing;

  -- Trust fields (disable trigger for demo profile levels)
  alter table public.profiles disable trigger profiles_protect_trust_fields;

  update public.profiles set display_name = 'Marie K.', verification_level = 'verified', is_seller = true, bio = 'Vendeuse vérifiée — Gombe'
    where id = seller1;
  update public.profiles set display_name = 'Jean-Paul M.', verification_level = 'phone', is_seller = true, bio = 'Véhicules & pièces — Ngaliema'
    where id = seller2;
  update public.profiles set display_name = 'Grace T.', verification_level = 'id_pending', is_seller = true, bio = 'Immobilier Limete'
    where id = seller3;
  update public.profiles set display_name = 'Patrick N.', verification_level = 'phone', is_seller = false
    where id = buyer1;
  update public.profiles set display_name = 'Amina B.', verification_level = 'phone', is_seller = false
    where id = buyer2;

  alter table public.profiles enable trigger profiles_protect_trust_fields;

  select id into cat_phones from public.categories where slug = 'telephones-electronique';
  select id into cat_vehicles from public.categories where slug = 'vehicules-motos';
  select id into cat_immo from public.categories where slug = 'immobilier';
  select id into cat_mode from public.categories where slug = 'mode-beaute';
  select id into cat_maison from public.categories where slug = 'maison-jardin';
  select id into sub_smart from public.subcategories where slug = 'smartphones' limit 1;
  select id into sub_laptop from public.subcategories where slug = 'laptops' limit 1;
  select id into sub_voiture from public.subcategories where slug = 'voitures' limit 1;
  select id into sub_moto from public.subcategories where slug = 'motos' limit 1;
  select id into sub_location from public.subcategories where slug = 'location' limit 1;
  select id into sub_vente from public.subcategories where slug = 'vente' limit 1;
  select id into loc_gombe from public.locations where slug = 'gombe';
  select id into loc_ngaliema from public.locations where slug = 'ngaliema';
  select id into loc_limete from public.locations where slug = 'limete';
  select id into loc_kalamu from public.locations where slug = 'kalamu-matonge';
  select id into loc_binza from public.locations where slug = 'ngaliema-binza';

  insert into public.listings (id, seller_id, category_id, subcategory_id, location_id, title, description, price, currency, negociable, status, verification_status, is_featured, published_at)
  values
    ('b1111111-1111-4111-8111-111111111111', seller1, cat_phones, sub_smart, loc_gombe,
     'iPhone 14 Pro Max 256 Go', 'État impeccable, batterie 89%. Boîte et chargeur inclus. Remise en main propre à Gombe.', 650, 'USD', true, 'active', 'verified', true, now() - interval '2 hours'),
    ('b1111111-1111-4111-8111-111111111112', seller1, cat_phones, sub_smart, loc_ngaliema,
     'Samsung Galaxy S23 Ultra', '128 Go, noir. Facture disponible. Ngaliema.', 480, 'USD', true, 'active', 'unverified', false, now() - interval '5 hours'),
    ('b1111111-1111-4111-8111-111111111113', seller2, cat_phones, sub_smart, loc_limete,
     'Redmi Note 13 Pro', 'Neuf sous blister. 256 Go.', 1850000, 'CDF', false, 'active', 'unverified', false, now() - interval '1 day'),
    ('b1111111-1111-4111-8111-111111111114', seller2, cat_phones, sub_laptop, loc_gombe,
     'MacBook Air M2 2022', '8 Go RAM, 256 Go SSD. Peu servi.', 780, 'USD', true, 'active', 'pending', false, now() - interval '6 hours'),
    ('b1111111-1111-4111-8111-111111111115', seller3, cat_phones, sub_smart, loc_binza,
     'iPhone 13 128 Go', 'Bon état, coque incluse. Binza.', 420, 'USD', true, 'active', 'verified', false, now() - interval '9 hours'),
    ('b2222222-2222-4222-8222-222222222221', seller1, cat_vehicles, sub_voiture, loc_gombe,
     'Toyota RAV4 2019', 'Automatique, climatisation, 78 000 km. Entretien à jour.', 18500, 'USD', true, 'active', 'verified', true, now() - interval '3 hours'),
    ('b2222222-2222-4222-8222-222222222222', seller2, cat_vehicles, sub_moto, loc_ngaliema,
     'Honda CG 125', 'Moto en bon état, papiers à jour. Idéal livraison.', 2200, 'USD', true, 'active', 'unverified', false, now() - interval '8 hours'),
    ('b2222222-2222-4222-8222-222222222223', seller1, cat_vehicles, sub_voiture, loc_limete,
     'Toyota Corolla 2015', 'Manuelle, essence. Limete Kingabwa.', 9500, 'USD', true, 'active', 'unverified', false, now() - interval '2 days'),
    ('b2222222-2222-4222-8222-222222222224', seller2, cat_vehicles, sub_voiture, loc_gombe,
     'Land Cruiser Prado 2017', 'Diesel, 7 places, climatisation arrière.', 32000, 'USD', true, 'active', 'verified', true, now() - interval '1 day'),
    ('b2222222-2222-4222-8222-222222222225', seller3, cat_vehicles, sub_moto, loc_kalamu,
     'Yamaha FZ150', 'Moto 2021, faible kilométrage. Matonge.', 2800, 'USD', true, 'active', 'unverified', false, now() - interval '14 hours'),
    ('b3333333-3333-4333-8333-333333333331', seller1, cat_immo, sub_location, loc_gombe,
     'Appartement 3 chambres — Gombe', 'Vue ville, sécurité 24h, parking. Loyer mensuel.', 1200, 'USD', true, 'active', 'verified', true, now() - interval '4 hours'),
    ('b3333333-3333-4333-8333-333333333332', seller2, cat_immo, sub_location, loc_binza,
     'Studio meublé — Binza', 'Eau et électricité incluses. Disponible immédiatement.', 450, 'USD', false, 'active', 'unverified', false, now() - interval '12 hours'),
    ('b3333333-3333-4333-8333-333333333333', seller3, cat_immo, sub_location, loc_limete,
     'Maison 4 chambres — Limete', 'Cour, garage 2 voitures. Quartier calme.', 850000000, 'CDF', true, 'active', 'unverified', false, now() - interval '3 days'),
    ('b3333333-3333-4333-8333-333333333334', seller1, cat_immo, sub_location, loc_ngaliema,
     'Bureau 80 m² — Ma Campagne', 'Idéal cabinet ou startup. Fibre disponible.', 900, 'USD', true, 'active', 'unverified', false, now() - interval '18 hours'),
    ('b3333333-3333-4333-8333-333333333335', seller3, cat_immo, sub_vente, loc_gombe,
     'Terrain 500 m² — Nsele', 'Titre foncier disponible. Accès route principale.', 45000, 'USD', true, 'active', 'verified', false, now() - interval '2 days'),
    ('b4444444-4444-4444-8444-444444444441', seller2, cat_mode, null, loc_kalamu,
     'Sac à main cuir — neuf', 'Marque locale, jamais utilisé. Matonge.', 85, 'USD', false, 'active', 'unverified', false, now() - interval '20 hours'),
    ('b4444444-4444-4444-8444-444444444442', seller3, cat_maison, null, loc_limete,
     'Canapé 3 places', 'Bon état, livraison possible Limete.', 3500000, 'CDF', true, 'active', 'unverified', false, now() - interval '1 day'),
    ('b4444444-4444-4444-8444-444444444443', seller1, cat_phones, sub_smart, loc_gombe,
     'AirPods Pro 2', 'Originaux, boîte complète.', 180, 'USD', true, 'active', 'verified', false, now() - interval '7 hours');

  insert into public.listing_media (listing_id, storage_path, sort_order, is_cover) values
    ('b1111111-1111-4111-8111-111111111111', 'https://picsum.photos/seed/soko-iphone/800/600', 0, true),
    ('b1111111-1111-4111-8111-111111111111', 'https://picsum.photos/seed/soko-iphone2/800/600', 1, false),
    ('b1111111-1111-4111-8111-111111111112', 'https://picsum.photos/seed/soko-samsung/800/600', 0, true),
    ('b1111111-1111-4111-8111-111111111113', 'https://picsum.photos/seed/soko-redmi/800/600', 0, true),
    ('b1111111-1111-4111-8111-111111111114', 'https://picsum.photos/seed/soko-mac/800/600', 0, true),
    ('b1111111-1111-4111-8111-111111111115', 'https://picsum.photos/seed/soko-iphone13/800/600', 0, true),
    ('b2222222-2222-4222-8222-222222222221', 'https://picsum.photos/seed/soko-rav4/800/600', 0, true),
    ('b2222222-2222-4222-8222-222222222222', 'https://picsum.photos/seed/soko-moto/800/600', 0, true),
    ('b2222222-2222-4222-8222-222222222223', 'https://picsum.photos/seed/soko-corolla/800/600', 0, true),
    ('b2222222-2222-4222-8222-222222222224', 'https://picsum.photos/seed/soko-prado/800/600', 0, true),
    ('b2222222-2222-4222-8222-222222222225', 'https://picsum.photos/seed/soko-yamaha/800/600', 0, true),
    ('b3333333-3333-4333-8333-333333333331', 'https://picsum.photos/seed/soko-apt/800/600', 0, true),
    ('b3333333-3333-4333-8333-333333333332', 'https://picsum.photos/seed/soko-studio/800/600', 0, true),
    ('b3333333-3333-4333-8333-333333333333', 'https://picsum.photos/seed/soko-maison/800/600', 0, true),
    ('b3333333-3333-4333-8333-333333333334', 'https://picsum.photos/seed/soko-bureau/800/600', 0, true),
    ('b3333333-3333-4333-8333-333333333335', 'https://picsum.photos/seed/soko-terrain/800/600', 0, true),
    ('b4444444-4444-4444-8444-444444444441', 'https://picsum.photos/seed/soko-sac/800/600', 0, true),
    ('b4444444-4444-4444-8444-444444444442', 'https://picsum.photos/seed/soko-canape/800/600', 0, true),
    ('b4444444-4444-4444-8444-444444444443', 'https://picsum.photos/seed/soko-airpods/800/600', 0, true);

  -- Demo favorites (buyer1 saved top listings)
  insert into public.favorites (user_id, listing_id) values
    (buyer1, 'b1111111-1111-4111-8111-111111111111'),
    (buyer1, 'b2222222-2222-4222-8222-222222222224'),
    (buyer1, 'b3333333-3333-4333-8333-333333333331'),
    (buyer2, 'b1111111-1111-4111-8111-111111111115'),
    (buyer2, 'b3333333-3333-4333-8333-333333333332')
  on conflict do nothing;

  -- Demo conversations + messages (visible when logged in as demo buyers — or for UI preview via service role)
  insert into public.conversations (id, listing_id, buyer_id, seller_id, last_message_at, created_at) values
    (conv1, 'b1111111-1111-4111-8111-111111111111', buyer1, seller1, now() - interval '30 minutes', now() - interval '2 hours'),
    (conv2, 'b2222222-2222-4222-8222-222222222224', buyer1, seller2, now() - interval '10 minutes', now() - interval '1 day'),
    (conv3, 'b3333333-3333-4333-8333-333333333332', buyer2, seller2, now() - interval '2 hours', now() - interval '3 hours')
  on conflict do nothing;

  insert into public.messages (id, conversation_id, sender_id, body, read_at, created_at) values
    ('d1111111-1111-4111-8111-111111111111', conv1, buyer1, 'Bonjour, l''iPhone est toujours disponible ?', now() - interval '1 hour', now() - interval '2 hours'),
    ('d1111111-1111-4111-8111-111111111112', conv1, seller1, 'Oui, disponible. On peut se voir à Gombe demain matin.', now() - interval '45 minutes', now() - interval '1 hour'),
    ('d1111111-1111-4111-8111-111111111113', conv1, buyer1, 'Parfait. Dernier prix 620 $ ?', null, now() - interval '30 minutes'),
    ('d2222222-2222-4222-8222-222222222221', conv2, buyer1, 'Le Prado a combien de km exactement ?', now() - interval '20 minutes', now() - interval '1 day'),
    ('d2222222-2222-4222-8222-222222222222', conv2, seller2, '112 000 km, carnet d''entretien complet.', null, now() - interval '10 minutes'),
    ('d3333333-3333-4333-8333-333333333331', conv3, buyer2, 'Le studio est libre quand ?', null, now() - interval '2 hours')
  on conflict do nothing;

  -- Grace has pending ID verification
  insert into public.seller_verifications (user_id, id_document_path, selfie_path, status)
  values (seller3, 'demo/id-grace.pdf', 'demo/selfie-grace.jpg', 'pending')
  on conflict (user_id) do nothing;

  raise notice 'Soko demo seed complete: 18 listings, 3 conversations, 6 messages, 5 favorites';
end $$;
