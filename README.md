# Zandocod

Kinshasa’s verified classifieds marketplace — Le marché de confiance.

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

### Populate demo data (one command)

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

This applies schema + seeds **18 Kinshasa listings**, categories, chat threads, and favorites.

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

Manual ops: [`docs/OPS.md`](docs/OPS.md).

## Demo login (one-click)

To enable frictionless demo login at `/demo`:

1. Create two Supabase users (email/password) in your project: one for a buyer and one for a seller.
2. Set these environment variables in `.env.local` (and Vercel):
   - `DEMO_BUYER_EMAIL`, `DEMO_BUYER_PASSWORD`
   - `DEMO_SELLER_EMAIL`, `DEMO_SELLER_PASSWORD`
3. Deploy. Test at `/demo` — use “Essayer comme acheteur/vendeur”.

Tip: run `npm run setup:demo` first to seed listings, conversations, and favorites.

## Capacitor (store shells)

```bash
npm run build
npx cap init Zandocod com.zandocod.app --web-dir=out   # once
npx cap add ios && npx cap add android              # once
npx cap sync
```

Point `capacitor.config.json` `server.url` at your deployed Vercel URL for dev, or use static export for bundled builds.
