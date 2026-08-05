# Soko — Ops (manual review)

## Approve seller ID verification

Run in Supabase SQL editor (service role):

```sql
-- Replace USER_ID with the seller's auth.users id
update public.seller_verifications
set status = 'approved', reviewed_at = now(), reviewer_notes = 'Manual approve'
where user_id = 'USER_ID';

update public.profiles
set verification_level = 'verified'
where id = 'USER_ID';
```

## Approve / reject listing verification (Annonce vérifiée)

```sql
update public.listings
set verification_status = 'verified'  -- or 'rejected'
where id = 'LISTING_ID';
```

## Seller SMS on new message

1. Deploy edge function: `supabase functions deploy notify-seller-message`
2. Set secrets: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
3. Create Database Webhook on `public.messages` INSERT → function URL
