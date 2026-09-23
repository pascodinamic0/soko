# Zandocod

Kinshasa’s verified classifieds marketplace — *Le marché de confiance*.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth phone OTP, Postgres + RLS, Storage, Realtime)
- PWA-ready (`public/manifest.webmanifest`, theme `#0F3D2E`)

Brand source of truth: [`branding/`](branding/).

## Setup

```bash
npm install
cp .env.example .env.local
# fill Supabase URL + anon key
npx supabase start   # optional local stack
npx supabase db reset
npm run dev
```

Apply the migration in `supabase/migrations/` to your hosted project when ready. Enable **Phone** auth and wire Twilio (or another SMS provider) in the Supabase dashboard.

### Demo seed (Kinshasa data)

1. Add your database password to `.env.local`:
   ```
   SUPABASE_DB_PASSWORD=your_database_password
   ```
   (Supabase Dashboard → **Settings** → **Database** → database password)

2. Run:
   ```bash
   npm install
   npm run setup:demo
   ```

This applies schema + seeds **18 Kinshasa listings** (Phones, Vehicles, Property), categories, chat threads, and favorites.

## Demo accounts

Zandocod supports Email/Password and Google out of the box, plus Phone OTP (optional SMS provider).

- Buyer: `buyer@demo.zandocod.com` / `Passw0rd!`
- Seller: `seller@demo.zandocod.com` / `Passw0rd!`
- Admin/Moderator: `admin@demo.zandocod.com` / `Passw0rd!`

How to provision:
- Supabase Dashboard → Authentication → Providers: enable **Email** and optionally **Google**. For Email, disable "Confirm email" for instant sign-in during demo.
- Supabase Dashboard → Authentication → Users: add the three demo users above and set the passwords. (Alternatively, sign up in the app and then edit roles as needed.)
- Optional: Enable **Phone** provider if you want OTP login; seed already marks a few `+2438…` demo numbers as confirmed.

Note: When Supabase env vars are not configured, the app runs in read-only “demo mode” with static data for the home, search, categories, and listing detail. Auth, chat, favorites, and publishing require Supabase.

## Vercel deployment

1. Push this repo to GitHub (or your forge).
2. Create a new Vercel Project and import the repo.
3. Set Environment Variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Optional: `SUPABASE_DB_PASSWORD` (for running the seed in CI or a one-off machine)
   - Optional (Twilio SMS): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
4. Deploy. The app is a PWA and should be installable on mobile and desktop.

If you prefer to verify the app without live Supabase, deploy anyway — the “demo mode” will allow browsing and the `/demo` page explains the flows.

## App shell

Bottom nav: Accueil · Favoris · Publier(+) · Messages · Menu  
Auth: `/auth` — Congolese phone OTP (`+243…`).

## Routes

| Path | Screen |
|------|--------|
| `/` | Home feed + categories |
| `/recherche` | Search + filters |
| `/categorie/[slug]` | Category browse |
| `/annonce/[id]` | Listing detail |
| `/publier` | Post wizard |
| `/mes-annonces` | Seller listings |
| `/favoris` | Saved listings |
| `/messages` | Chat inbox |
| `/messages/[id]` | Chat thread |
| `/verification` | ID verification ladder |
| `/menu` | Account |
| `/demo` | Demo guide & test accounts |

Manual ops: [`docs/OPS.md`](docs/OPS.md).

## Capacitor (store shells)

```bash
npm run build
npx cap init Zandocod com.zandocod.kinshasa --web-dir=out   # once
npx cap add ios && npx cap add android              # once
npx cap sync
```

Point `capacitor.config.json` `server.url` at your deployed Vercel URL for dev, or use static export for bundled builds.
